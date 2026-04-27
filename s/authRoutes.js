import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Setup upload directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

// Helper functions
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

// SIGN UP
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const pool = getDB();
        
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
            [fullname, email, hashedPassword]
        );
        
        await pool.query(
            'INSERT INTO user_stats (user_id, total_tasks_completed, total_challenges_completed, current_streak) VALUES (?, 0, 0, 0)',
            [result.insertId]
        );
        
        const token = generateToken(result.insertId);
        
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: result.insertId,
                fullname,
                email,
                image: null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// SIGN IN
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = getDB();
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = generateToken(user.id);
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                image: user.image
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET CURRENT USER
router.get('/me', verifyToken, async (req, res) => {
    try {
        const pool = getDB();
        const [users] = await pool.query(
            'SELECT id, fullname, email, image, created_at FROM users WHERE id = ?',
            [req.userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ user: users[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPLOAD PROFILE IMAGE
router.post('/upload-image', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const pool = getDB();
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        
        await pool.query('UPDATE users SET image = ? WHERE id = ?', [imageUrl, req.userId]);
        
        res.json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;