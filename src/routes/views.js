import path from 'path';
import { VIEWS_DIR } from '../config/paths.js';
import { getUserFromCookie } from '../auth/session.js';
import { getPaidForUser } from '../data/userAccess.js';

function sendView(res, viewName) {
    return res.sendFile(path.join(VIEWS_DIR, viewName));
}

export function registerViewRoutes(app) {
    // Protected HTML gate: redirect if not paid
    // NOTE: this must come BEFORE the static middleware so the check runs
    app.get('/protected.html', async (req, res) => {
        const user = await getUserFromCookie(req, res);
        if (!user) return res.redirect('/login.html');

        let paid = false;
        try {
            paid = await getPaidForUser(user.id);
        } catch (e) {
            console.error('user_access read failed', e);
            return res.status(500).send('Server error');
        }

        if (!paid) return res.redirect('/pricing.html');
        return sendView(res, 'protected.html');
    });

    app.get('/', (req, res) => sendView(res, 'index.html'));
    app.get('/index.html', (req, res) => sendView(res, 'index.html'));
    app.get('/login.html', (req, res) => sendView(res, 'login.html'));
    app.get('/pricing.html', (req, res) => sendView(res, 'pricing.html'));
    app.get('/success.html', (req, res) => sendView(res, 'success.html'));
}
