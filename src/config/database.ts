/* ------------------------------------------------------------------
 * Builds a rock-solid MongoDB Atlas URI from separate env variables
 * and opens a single Mongoose connection (re-used on warm invocations).
 * ------------------------------------------------------------------ */

import mongoose, {ConnectOptions} from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/* ---------- 1.  Read & validate required env vars ------------------ */
const {
    MONGO_USER,
    MONGO_PASS,
    MONGO_CLUSTER,          // e.g. cluster0.mttrr4c.mongodb.net
    MONGO_DB,               // e.g. insurance_portal
} = process.env;

if (!MONGO_USER || !MONGO_PASS || !MONGO_CLUSTER || !MONGO_DB) {
    throw new Error(
        '❌  Missing MongoDB env vars. Check MONGO_USER, MONGO_PASS, MONGO_CLUSTER, and MONGO_DB',
    );
}

/* ---------- 2.  Build a _bullet-proof_ Atlas URI ------------------- */

const mongoUri = `mongodb+srv://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(
    MONGO_PASS,
)}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;

/* ---------- 3.  Connection helper ---------------------------------- */

export async function initDB(): Promise<void> {
    try {
        /* Small, battle-tested defaults */
        const opts: ConnectOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5_000,
            socketTimeoutMS: 45_000,
        };

        await mongoose.connect(mongoUri, opts);

        /* Connected! */
        console.log(`✅  MongoDB connected → ${mongoose.connection.name}`);

        /* Optional: sensible event logging */
        mongoose.connection.on('disconnected', () =>
            console.warn('⚠️   MongoDB disconnected'),
        );
        mongoose.connection.on('reconnected', () =>
            console.log('✅  MongoDB re-connected'),
        );
    } catch (err) {
        console.error('❌  MongoDB connection error:', err);
        throw new Error('Failed to connect to the database');
    }
}

/* ---------- 4.  Graceful shutdown ---------------------------------- */
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔒  MongoDB connection closed (app termination)');
    process.exit(0);
});
