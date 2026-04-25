// src/services/todoService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add auth token to requests
const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const todoService = {
    // Get all todo tasks for the current user
    getTasks: async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch tasks' };
        }
    },

    // Get single task by ID
    getTask: async (taskId) => {
        try {
            const response = await axios.get(`${API_URL}/tasks/${taskId}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch task' };
        }
    },

    // Create a new todo task
    createTask: async (title, items, expiresAt) => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, {
                title,
                items,
                expires_at: expiresAt
            }, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create task' };
        }
    },

    // Update an existing task
    updateTask: async (taskId, title, items, expiresAt) => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${taskId}`, {
                title,
                items,
                expires_at: expiresAt
            }, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update task' };
        }
    },

    // Toggle item completion status
    toggleItem: async (taskId, itemId, completed) => {
        try {
            const response = await axios.patch(`${API_URL}/tasks/${taskId}/items/${itemId}`, {
                completed
            }, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update item' };
        }
    },

    // Delete a todo task
    deleteTask: async (taskId) => {
        try {
            const response = await axios.delete(`${API_URL}/tasks/${taskId}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete task' };
        }
    },

    // Format expiration for display
    formatExpiration: (expiresAt) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffMs = expiry - now;
        
        if (diffMs <= 0) {
            return { value: 0, unit: 'expired' };
        }
        
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffMinutes < 60) {
            return { value: diffMinutes, unit: 'minutes' };
        } else if (diffMinutes < 1440) {
            return { value: Math.floor(diffMinutes / 60), unit: 'hours' };
        } else {
            return { value: Math.floor(diffMinutes / 1440), unit: 'days' };
        }
    }
};

export default todoService;