// src/services/challengeService.js
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

const challengeService = {
    // Get all challenges for the current user
    getChallenges: async () => {
        try {
            const response = await axios.get(`${API_URL}/challenges`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch challenges' };
        }
    },

    // Get single challenge by ID
    getChallenge: async (challengeId) => {
        try {
            const response = await axios.get(`${API_URL}/challenges/${challengeId}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch challenge' };
        }
    },

    // Create a new challenge
    createChallenge: async (title, tasks, duration, coverColor) => {
        try {
            const response = await axios.post(`${API_URL}/challenges`, {
                title,
                tasks,
                duration,
                cover_color: coverColor
            }, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create challenge' };
        }
    },

    // Update challenge progress for a specific day and task
    updateProgress: async (challengeId, dayNumber, taskIndex, completed) => {
        try {
            const response = await axios.put(`${API_URL}/challenges/${challengeId}/progress`, {
                day_number: dayNumber,
                task_index: taskIndex,
                completed
            }, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update progress' };
        }
    },

    // Delete a challenge
    deleteChallenge: async (challengeId) => {
        try {
            const response = await axios.delete(`${API_URL}/challenges/${challengeId}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete challenge' };
        }
    }
};

export default challengeService;