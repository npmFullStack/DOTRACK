import express from 'express';
import { getDB } from './db.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// GET all challenges for user
router.get('/', verifyToken, async (req, res) => {
    try {
        const pool = getDB();
        const [challenges] = await pool.query(
            `SELECT c.*, 
                    COUNT(DISTINCT cp.id) as completed_tasks
             FROM challenges c
             LEFT JOIN challenge_progress cp ON c.id = cp.challenge_id AND cp.completed = TRUE
             WHERE c.user_id = ?
             GROUP BY c.id
             ORDER BY c.created_at DESC`,
            [req.userId]
        );
        
        // Get tasks for each challenge
        for (let challenge of challenges) {
            const [tasks] = await pool.query(
                'SELECT task_text FROM challenge_tasks WHERE challenge_id = ? ORDER BY task_order',
                [challenge.id]
            );
            challenge.tasks = tasks.map(t => t.task_text);
        }
        
        res.json({ challenges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single challenge
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const challengeId = req.params.id;
        const pool = getDB();
        
        const [challenges] = await pool.query(
            'SELECT * FROM challenges WHERE id = ? AND user_id = ?',
            [challengeId, req.userId]
        );
        
        if (challenges.length === 0) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        
        const challenge = challenges[0];
        
        const [tasks] = await pool.query(
            'SELECT * FROM challenge_tasks WHERE challenge_id = ? ORDER BY task_order',
            [challengeId]
        );
        
        const [progress] = await pool.query(
            'SELECT day_number, task_index, completed FROM challenge_progress WHERE challenge_id = ? AND user_id = ?',
            [challengeId, req.userId]
        );
        
        const progressByDay = {};
        progress.forEach(p => {
            if (!progressByDay[p.day_number]) {
                progressByDay[p.day_number] = {};
            }
            progressByDay[p.day_number][p.task_index] = p.completed;
        });
        
        res.json({
            challenge: {
                id: challenge.id,
                title: challenge.title,
                duration: challenge.duration,
                cover_color: challenge.cover_color,
                createdAt: challenge.created_at,
                tasks: tasks.map(t => t.task_text),
                progress: progressByDay
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE challenge
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, duration, cover_color, tasks } = req.body;
        const pool = getDB();
        
        if (!title || !duration || !tasks || tasks.length === 0) {
            return res.status(400).json({ message: 'Title, duration, and tasks are required' });
        }
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            const [result] = await connection.query(
                'INSERT INTO challenges (user_id, title, duration, cover_color) VALUES (?, ?, ?, ?)',
                [req.userId, title, duration, cover_color || 'lime']
            );
            
            const challengeId = result.insertId;
            
            for (let i = 0; i < tasks.length; i++) {
                await connection.query(
                    'INSERT INTO challenge_tasks (challenge_id, task_text, task_order) VALUES (?, ?, ?)',
                    [challengeId, tasks[i], i]
                );
            }
            
            await connection.commit();
            
            res.status(201).json({
                message: 'Challenge created successfully',
                challenge: { id: challengeId, title, duration }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE challenge progress
router.put('/:id/progress', verifyToken, async (req, res) => {
    try {
        const challengeId = req.params.id;
        const { day_number, task_index, completed } = req.body;
        const pool = getDB();
        
        const [challenges] = await pool.query(
            'SELECT id, duration FROM challenges WHERE id = ? AND user_id = ?',
            [challengeId, req.userId]
        );
        
        if (challenges.length === 0) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        
        await pool.query(
            `INSERT INTO challenge_progress (challenge_id, user_id, day_number, task_index, completed, completed_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             completed = VALUES(completed),
             completed_at = VALUES(completed_at)`,
            [challengeId, req.userId, day_number, task_index, completed, completed ? new Date() : null]
        );
        
        if (completed) {
            await pool.query(
                `UPDATE user_stats 
                 SET total_tasks_completed = total_tasks_completed + 1
                 WHERE user_id = ?`,
                [req.userId]
            );
        }
        
        res.json({ message: 'Progress updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE challenge
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const challengeId = req.params.id;
        const pool = getDB();
        
        const [result] = await pool.query(
            'DELETE FROM challenges WHERE id = ? AND user_id = ?',
            [challengeId, req.userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        
        res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;