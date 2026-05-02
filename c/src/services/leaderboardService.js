// src/services/leaderboardService.js
import { supabase } from '@/config/supabase'

const leaderboardService = {
    /**
     * Fetch the global leaderboard — all users ranked by total completed items.
     * Joins with profiles to get display name and avatar.
     * @param {number} limit - how many rows to return (default 50)
     */
    async getLeaderboard(limit = 50) {
        const { data, error } = await supabase
            .from('leaderboards')
            .select(`
                user_id,
                total_completed,
                updated_at,
                profiles (
                    full_name,
                    avatar
                )
            `)
            .order('total_completed', { ascending: false })
            .limit(limit)

        if (error) throw error

        // Flatten profiles into each row for easy consumption
        return data.map((row, index) => ({
            rank: index + 1,
            user_id: row.user_id,
            full_name: row.profiles?.full_name || 'Anonymous',
            avatar: row.profiles?.avatar || null,
            total_completed: row.total_completed,
            updated_at: row.updated_at
        }))
    },

    /**
     * Fetch the leaderboard row for the currently signed-in user.
     * Returns null if the user has no completed items yet.
     */
    async getCurrentUserRank() {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) return null

        // Get the user's leaderboard entry
        const { data: entry, error: entryError } = await supabase
            .from('leaderboards')
            .select('user_id, total_completed, updated_at')
            .eq('user_id', user.id)
            .maybeSingle()

        if (entryError) throw entryError
        if (!entry) return null

        // Count how many users scored higher to determine rank
        const { count, error: countError } = await supabase
            .from('leaderboards')
            .select('*', { count: 'exact', head: true })
            .gt('total_completed', entry.total_completed)

        if (countError) throw countError

        return {
            rank: (count ?? 0) + 1,
            user_id: user.id,
            total_completed: entry.total_completed,
            updated_at: entry.updated_at
        }
    }
}

export default leaderboardService