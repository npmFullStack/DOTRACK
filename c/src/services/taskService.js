// src/services/taskService.js
import { supabase } from '@/config/supabase'

const taskService = {
    // ── Helpers ───────────────────────────────────────────────

    /** Format a Date object or ISO string for human-readable expiration display */
    formatExpiration(expiresAt) {
        if (!expiresAt) return null
        const now = new Date()
        const exp = new Date(expiresAt)
        const diffMs = exp - now

        if (diffMs <= 0) return 'Expired'

        const diffMins = Math.floor(diffMs / 1000 / 60)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins}m`
        if (diffHours < 24) return `${diffHours}h`
        return `${diffDays}d`
    },

    // ── Tasks ─────────────────────────────────────────────────

    /** Fetch all tasks (with their items) for the current user */
    async getTasks() {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error('Not authenticated')

        const { data: tasks, error } = await supabase
            .from('tasks')
            .select(`
                id,
                title,
                expires_at,
                created_at,
                updated_at,
                task_items (
                    id,
                    item_text,
                    completed,
                    completed_at,
                    created_at
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        return tasks || []
    },

    /** Fetch a single task with its items */
    async getTask(taskId) {
        const { data: task, error } = await supabase
            .from('tasks')
            .select(`
                id,
                title,
                expires_at,
                created_at,
                updated_at,
                task_items (
                    id,
                    item_text,
                    completed,
                    completed_at,
                    created_at
                )
            `)
            .eq('id', taskId)
            .single()

        if (error) throw error
        return task
    },

    /**
     * Create a new task with items.
     * @param {string} title
     * @param {string[]} items  - array of item text strings
     * @param {Date|string} expiresAt
     */
    async createTask(title, items, expiresAt) {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error('Not authenticated')

        // 1. Insert the task
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .insert({
                user_id: user.id,
                title: title.trim(),
                expires_at: new Date(expiresAt).toISOString()
            })
            .select()
            .single()

        if (taskError) throw taskError

        // 2. Insert the items
        const itemRows = items
            .filter(text => text && text.trim())
            .map(text => ({
                task_id: task.id,
                item_text: text.trim(),
                completed: false
            }))

        if (itemRows.length > 0) {
            const { error: itemsError } = await supabase
                .from('task_items')
                .insert(itemRows)

            if (itemsError) throw itemsError
        }

        return task
    },

    /**
     * Update a task's title, expiry, and replace its items.
     * @param {string} taskId
     * @param {string} title
     * @param {string[]} items
     * @param {Date|string} expiresAt
     */
    async updateTask(taskId, title, items, expiresAt) {
        // 1. Update the task row
        const { error: taskError } = await supabase
            .from('tasks')
            .update({
                title: title.trim(),
                expires_at: new Date(expiresAt).toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)

        if (taskError) throw taskError

        // 2. Delete old items
        const { error: deleteError } = await supabase
            .from('task_items')
            .delete()
            .eq('task_id', taskId)

        if (deleteError) throw deleteError

        // 3. Insert new items
        const itemRows = items
            .filter(text => text && text.trim())
            .map(text => ({
                task_id: taskId,
                item_text: text.trim(),
                completed: false
            }))

        if (itemRows.length > 0) {
            const { error: itemsError } = await supabase
                .from('task_items')
                .insert(itemRows)

            if (itemsError) throw itemsError
        }

        return true
    },

    /** Delete a task (cascade removes its items via FK) */
    async deleteTask(taskId) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)

        if (error) throw error
        return true
    },

    // ── Task Items ────────────────────────────────────────────

    /**
     * Toggle a task item's completed state.
     * The DB trigger will automatically update the leaderboard.
     * @param {string} itemId
     * @param {boolean} completed
     */
    async toggleItem(itemId, completed) {
        const { data, error } = await supabase
            .from('task_items')
            .update({ 
                completed: completed,
                updated_at: new Date().toISOString()
            })
            .eq('id', itemId)
            .select()
            .single()

        if (error) throw error
        return data
    }
}

export default taskService