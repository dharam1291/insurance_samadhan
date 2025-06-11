/*  ------------------------------------------------------------------
* One file for every environment:
*  • Netlify Functions / AWS Lambda   → exports `handler`
*   • Local development (`netlify dev` or `npm run dev`)
*       → starts an Express server on localhost.
* ------------------------------------------------------------------ */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import {initDB} from './config/database';
import complaintRoutes from './routes/complaint.routes';
import fraudRoutes from './routes/fraud.routes';
import {errorHandler} from './middleware/errorHandler';

dotenv.config();

const app = express();
/* ── MUST be before the limiter ───────────────────────────────────── */
app.set('trust proxy', 1);          // trust exactly one proxy hop

// Security middleware
app.use(helmet());
app.use(cors());

/* Netlify passes the real client IP in this header */
const getClientIp = (req: express.Request): string => {
    const ip = req.headers['x-nf-client-connection-ip'];
    if (Array.isArray(ip)) return ip[0];
    return ip ?? req.ip ?? 'unknown';
};

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60_000,           // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
    /* 🔑  Netlify-friendly IP extractor  */
    keyGenerator: getClientIp
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

// Connect to MongoDB
(async () => {
    await initDB();
})();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Complaint & Fraud Management Service'
    });
});

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/fraud', fraudRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({error: 'Route not found'});
});

/* ── Local dev: open a port  ───────────────────────────────────────── */
if (process.env.NETLIFY_LOCAL === 'true' || process.env.NODE_ENV !== 'production') {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => console.log(`🚀  Local API on http://localhost:${PORT}`));
}
/* ── Netlify / AWS Lambda export ──────────────────────────────────── */
export const handler = serverless(app);