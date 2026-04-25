import express from 'express';
import pool from './db.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// GET all todo tasks
router.get('/', verifyToken, async (req, res) => {
    try {
        const [tasks] = await pool.query(
            `SELECT t.* FROM todo_tasks t
             WHERE t.user_id = ?
             ORDER BY t.expires_at ASC`,
            [req.userId]
        );
        
        for (let task of tasks) {
            const [items] = await pool.query(
                'SELECT id, item_text, completed, item_order FROM todo_items WHERE todo_task_id = ? ORDER BY item_order',
                [task.id]
            );
            task.items = items;
        }
        
        res.json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE todo task
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, items, expires_at } = req.body;
        
        if (!title || !items || items.length === 0 || !expires_at) {
            return res.status(400).json({ message: 'Title, items, and expiration date are required' });
        }
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            const [result] = await connection.query(
                'INSERT INTO todo_tasks (user_id, title, expires_at) VALUES (?, ?, ?)',
                [req.userId, title, expires_at]
            );
            
            const taskId = result.insertId;
            
            for (let i = 0; i < items.length; i++) {
                await connection.query(
                    'INSERT INTO todo_items (todo_task_id, item_text, item_order) VALUES (?, ?, ?)',
                    [taskId, items[i], i]
                );
            }
            
            await connection.commit();
            
            res.status(201).json({
                message: 'Task created successfully',
                task: { id: taskId, title }
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

// UPDATE todo item completion
router.patch('/:taskId/items/:itemId', verifyToken, async (req, res) => {
    try {
        const { taskId, itemId } = req.params;
        const { completed } = req.body;
        
        const [tasks] = await pool.query(
            'SELECT id FROM todo_tasks WHERE id = ? AND user_id = ?',
            [taskId, req.userId]
        );
        
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        await pool.query(
            'UPDATE todo_items SET completed = ?, completed_at = ? WHERE id = ? AND todo_task_id = ?',
            [completed, completed ? new Date() : null, itemId, taskId]
        );
        
        if (completed) {
            await pool.query(
                `UPDATE user_stats 
                 SET total_tasks_completed = total_tasks_completed + 1
                 WHERE user_id = ?`,
                [req.userId]
            );
        }
        
        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single todo task by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        
        const [tasks] = await pool.query(
            'SELECT * FROM todo_tasks WHERE id = ? AND user_id = ?',
            [taskId, req.userId]
        );
        
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const task = tasks[0];
        
        const [items] = await pool.query(
            'SELECT id, item_text, completed, item_order FROM todo_items WHERE todo_task_id = ? ORDER BY item_order',
            [taskId]
        );
        
        task.items = items;
        
        res.json({ task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE todo task
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, items, expires_at } = req.body;
        
        if (!title || !items || items.length === 0 || !expires_at) {
            return res.status(400).json({ message: 'Title, items, and expiration date are required' });
        }
        
        // Verify task belongs to user
        const [tasks] = await pool.query(
            'SELECT id FROM todo_tasks WHERE id = ? AND user_id = ?',
            [taskId, req.userId]
        );
        
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Update task title and expiration
            await connection.query(
                'UPDATE todo_tasks SET title = ?, expires_at = ? WHERE id = ?',
                [title, expires_at, taskId]
            );
            
            // Delete existing items
            await connection.query('DELETE FROM todo_items WHERE todo_task_id = ?', [taskId]);
            
            // Insert updated items
            for (let i = 0; i < items.length; i++) {
                await connection.query(
                    'INSERT INTO todo_items (todo_task_id, item_text, item_order) VALUES (?, ?, ?)',
                    [taskId, items[i], i]
                );
            }
            
            await connection.commit();
            
            res.json({
                message: 'Task updated successfully',
                task: { id: taskId, title }
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

// DELETE todo task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        
        const [result] = await pool.query(
            'DELETE FROM todo_tasks WHERE id = ? AND user_id = ?',
            [taskId, req.userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;