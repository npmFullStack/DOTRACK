import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDatabase } from './db.js';
import authRoutes from './authRoutes.js';
import challengeRoutes from './challengeRoutes.js';
import taskRoutes from './taskRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow your frontend
const allowedOrigins = [
    'https://dotrack.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Root route - simple health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'DoTrack API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            challenges: '/api/challenges',
            tasks: '/api/tasks',
            leaderboard: '/api/leaderboard'
        }
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        requestedUrl: req.originalUrl 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Start server with better error handling
async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Database host: ${process.env.DB_HOST}`);
            console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();