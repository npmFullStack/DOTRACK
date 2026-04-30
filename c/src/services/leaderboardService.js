// src/services/leaderboardService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const leaderboardService = {
    // Get leaderboard with top users
    getLeaderboard: async (limit = 10) => {
        try {
            const response = await axios.get(`${API_URL}/api/leaderboard?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch leaderboard' };
        }
    },

    // Get specific user stats with rank
    getUserStats: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/leaderboard/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch user stats' };
        }
    },

    // Get dashboard stats for logged in user
    getDashboardStats: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/leaderboard/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
        }
    }
};

export default leaderboardService;