import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { BASE_URL, IS_PROD, PORT } from './src/config/env.js';
import { PUBLIC_DIR } from './src/config/paths.js';
import { apiAccessRouter } from './src/routes/apiAccess.js';
import { apiAuthRouter } from './src/routes/apiAuth.js';
import { apiStripeRouter } from './src/routes/apiStripe.js';
import { registerStripeWebhook } from './src/routes/stripeWebhook.js';
import { registerViewRoutes } from './src/routes/views.js';

const app = express();

if (IS_PROD) {
    // Needed when behind a proxy (Render/Fly/Vercel/NGINX, etc.) so secure cookies + req.protocol work.
    app.set('trust proxy', 1);
}

app.use(
    helmet({
        contentSecurityPolicy: false, // keep simple for demo HTML; enable/tighten when you add scripts/assets
    })
);

// Cookies first (used by auth helpers)
app.use(cookieParser());

// HTML routes (incl. protected gate)
registerViewRoutes(app);

// Static files (served after protected.html guard)
app.use(express.static(PUBLIC_DIR));

// JSON for normal routes
app.use('/api', express.json());

// API routes
app.use('/api/auth', apiAuthRouter());
app.use('/api', apiAccessRouter());
app.use('/api/stripe', apiStripeRouter());

// Stripe webhook route
registerStripeWebhook(app);

app.listen(PORT, () => {
    console.log(`Server running: ${BASE_URL}`);
});
