import express from 'express';
import { getDB } from './db.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// GET leaderboard
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const pool = getDB();
        
        const [leaderboard] = await pool.query(
            `SELECT u.id, u.fullname, u.image, COALESCE(us.total_tasks_completed, 0) as tasks_completed
             FROM users u
             LEFT JOIN user_stats us ON u.id = us.user_id
             ORDER BY tasks_completed DESC
             LIMIT ?`,
            [limit]
        );
        
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            ...user,
            rank: index + 1
        }));
        
        res.json({ leaderboard: rankedLeaderboard });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET user stats with rank
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const pool = getDB();
        
        const [stats] = await pool.query(
            `SELECT u.id, u.fullname, u.image, COALESCE(us.total_tasks_completed, 0) as tasks_completed,
                    COALESCE(us.total_challenges_completed, 0) as challenges_completed,
                    COALESCE(us.current_streak, 0) as current_streak
             FROM users u
             LEFT JOIN user_stats us ON u.id = us.user_id
             WHERE u.id = ?`,
            [userId]
        );
        
        if (stats.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const [rankResult] = await pool.query(
            `SELECT COUNT(*) + 1 as rank
             FROM user_stats
             WHERE total_tasks_completed > (SELECT COALESCE(total_tasks_completed, 0) FROM user_stats WHERE user_id = ?)`,
            [userId]
        );
        
        res.json({
            stats: stats[0],
            rank: rankResult[0].rank
        });
    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET dashboard stats for logged in user
router.get('/dashboard/stats', verifyToken, async (req, res) => {
    try {
        const pool = getDB();
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
             LEFT JOIN todo_items ti ON t.id = ti.todo_task_id 
             WHERE t.user_id = ? AND t.expires_at > NOW() AND (ti.completed = FALSE OR ti.completed IS NULL)`,
            [req.userId]
        );
        
        res.json({
            stats: stats[0] || { total_tasks_completed: 0, total_challenges_completed: 0, current_streak: 0 },
            activeChallenges: challenges[0]?.count || 0,
            pendingTasks: pendingTasks[0]?.count || 0
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;