// src/services/leaderboardService.js
import { supabase } from '@/config/supabase'

const leaderboardService = {
    /**
     * Fetch the global leaderboard — all users ranked by total completed items.
     * Joins with profiles to get display name and avatar.
     * @param {number} limit - how many rows to return (default 100)
     */
    async getLeaderboard(limit = 100) {
        try {
            // ✅ FIX: Query leaderboards and profiles in one go.
            //         The "Public can view profile names and avatars" RLS policy
            //         now allows this to return ALL users' names, not just the
            //         currently signed-in user.
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
            if (!data || data.length === 0) return []

            return data.map((row, index) => ({
                rank: index + 1,
                user_id: row.user_id,
                full_name: row.profiles?.full_name || 'Anonymous',
                avatar: row.profiles?.avatar || null,
                total_completed: row.total_completed || 0,
                updated_at: row.updated_at
            }))
        } catch (error) {
            console.error('Error fetching leaderboard:', error)
            throw error
        }
    },

    /**
     * Fetch the leaderboard row for the currently signed-in user.
     * Returns null if the user is not signed in.
     */
    async getCurrentUserRank() {
        try {
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

            // Count how many users scored strictly higher to determine rank
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
        } catch (error) {
            console.error('Error getting current user rank:', error)
            return null
        }
    },

    /**
     * Force refresh leaderboard for all users (admin function).
     * Call this if counts ever get out of sync.
     */
    async refreshLeaderboard() {
        try {
            const { data, error } = await supabase.rpc('initialize_leaderboards')
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error refreshing leaderboard:', error)
            throw error
        }
    }
}

export default leaderboardService