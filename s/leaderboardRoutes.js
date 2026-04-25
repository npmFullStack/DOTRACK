import express from 'express';
import pool from './db.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// GET leaderboard
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const [leaderboard] = await pool.query(
            `SELECT u.id, u.fullname, u.image, us.total_tasks_completed as tasks_completed
             FROM user_stats us
             JOIN users u ON us.user_id = u.id
             ORDER BY us.total_tasks_completed DESC
             LIMIT ?`,
            [limit]
        );
        
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            ...user,
            rank: index + 1
        }));
        
        res.json({ leaderboard: rankedLeaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET user stats with rank
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const [stats] = await pool.query(
            `SELECT u.id, u.fullname, u.image, us.total_tasks_completed as tasks_completed,
                    us.total_challenges_completed as challenges_completed,
                    us.current_streak
             FROM user_stats us
             JOIN users u ON us.user_id = u.id
             WHERE u.id = ?`,
            [userId]
        );
        
        if (stats.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const [rankResult] = await pool.query(
            `SELECT COUNT(*) + 1 as rank
             FROM user_stats
             WHERE total_tasks_completed > (SELECT total_tasks_completed FROM user_stats WHERE user_id = ?)`,
            [userId]
        );
        
        res.json({
            stats: stats[0],
            rank: rankResult[0].rank
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET dashboard stats for logged in user
router.get('/dashboard/stats', verifyToken, async (req, res) => {
    try {
        const [stats] = await pool.query(
            'SELECT * FROM user_stats WHERE user_id = ?',
            [req.userId]
        );
        
        const [challenges] = await pool.query(
            'SELECT COUNT(*) as count FROM challenges WHERE user_id = ?',
            [req.userId]
        );
        
        const [pendingTasks] = await pool.query(
            `SELECT COUNT(DISTINCT t.id) as count 
             FROM todo_tasks t
             LEFT JOIN todo_items ti ON t.id = ti.todo_task_id AND ti.completed = FALSE
             WHERE t.user_id = ? AND t.expires_at > NOW()
             GROUP BY t.id`,
            [req.userId]
        );
        
        res.json({
            stats: stats[0] || { total_tasks_completed: 0, total_challenges_completed: 0, current_streak: 0 },
            activeChallenges: challenges[0]?.count || 0,
            pendingTasks: pendingTasks.length || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;