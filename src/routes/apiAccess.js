import express from 'express';
import { requireUser } from '../auth/session.js';
import { getPaidForUser } from '../data/userAccess.js';

export function apiAccessRouter() {
    const router = express.Router();

    router.get('/me', requireUser, async (req, res) => {
        const user = req.user;

        let paid = false;
        try {
            paid = await getPaidForUser(user.id);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

        res.json({ ok: true, user: { id: user.id, email: user.email }, paid });
    });

    return router;
}
