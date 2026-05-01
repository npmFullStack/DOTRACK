// src/services/authService.js
import { supabase } from '@/config/supabase'

const authService = {
    // Sign up
    async signup(fullName, email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        })
        
        if (error) throw error
        
        // Profile will be auto-created by database trigger
        return data
    },
    
    // Sign in
    async signin(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        return data
    },
    
    // Sign out
    async signout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },
    
    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },
    
    // Get user profile
    async getProfile() {
        const user = await this.getCurrentUser()
        if (!user) return null
        
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        
        if (error) throw error
        return data
    },
    
    // Update user profile (including avatar)
    async updateProfile(updates) {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user logged in')
        
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()
        
        if (error) throw error
        return data
    },
    
    // Upload avatar
    async uploadAvatar(file) {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user logged in')
        
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`
        
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file)
        
        if (uploadError) throw uploadError
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)
        
        // Update profile with avatar URL
        await this.updateProfile({ avatar: publicUrl })
        
        return publicUrl
    }
}

export default authService