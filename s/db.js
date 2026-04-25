import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function initDatabase() {
    try {
        const connection = await pool.getConnection();
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.query(`USE ${process.env.DB_NAME}`);
        
        // Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                fullname VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                image VARCHAR(500) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Challenges table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS challenges (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                duration INT NOT NULL,
                cover_color VARCHAR(50) DEFAULT 'lime',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        // Challenge tasks table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS challenge_tasks (
                id INT PRIMARY KEY AUTO_INCREMENT,
                challenge_id INT NOT NULL,
                task_text TEXT NOT NULL,
                task_order INT DEFAULT 0,
                FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
            )
        `);
        
        // Challenge progress table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS challenge_progress (
                id INT PRIMARY KEY AUTO_INCREMENT,
                challenge_id INT NOT NULL,
                user_id INT NOT NULL,
                day_number INT NOT NULL,
                task_index INT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                completed_at TIMESTAMP NULL,
                UNIQUE KEY unique_progress (challenge_id, user_id, day_number, task_index),
                FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        // Todo tasks table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS todo_tasks (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        // Todo items table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS todo_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                todo_task_id INT NOT NULL,
                item_text TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                completed_at TIMESTAMP NULL,
                item_order INT DEFAULT 0,
                FOREIGN KEY (todo_task_id) REFERENCES todo_tasks(id) ON DELETE CASCADE
            )
        `);
        
        // User stats table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_stats (
                user_id INT PRIMARY KEY,
                total_tasks_completed INT DEFAULT 0,
                total_challenges_completed INT DEFAULT 0,
                current_streak INT DEFAULT 0,
                last_activity_date DATE NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

export default pool;