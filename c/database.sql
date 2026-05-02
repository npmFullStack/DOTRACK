-- database.sql
-- Run this in your Supabase SQL editor
-- Drop existing tables if re-running (order matters due to FK constraints)
DROP TABLE IF EXISTS public.leaderboards CASCADE;
DROP TABLE IF EXISTS public.task_items CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NULL);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_expires_at ON public.tasks(expires_at);

-- ============================================================
-- TASK ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.task_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    item_text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.task_items ENABLE ROW LEVEL SECURITY;

-- Task items inherit access through their parent task (join check)
DROP POLICY IF EXISTS "Users can view own task items" ON public.task_items;
CREATE POLICY "Users can view own task items" ON public.task_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_items.task_id
              AND tasks.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own task items" ON public.task_items;
CREATE POLICY "Users can insert own task items" ON public.task_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_items.task_id
              AND tasks.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own task items" ON public.task_items;
CREATE POLICY "Users can update own task items" ON public.task_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_items.task_id
              AND tasks.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own task items" ON public.task_items;
CREATE POLICY "Users can delete own task items" ON public.task_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_items.task_id
              AND tasks.user_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_task_items_task_id ON public.task_items(task_id);
CREATE INDEX IF NOT EXISTS idx_task_items_completed ON public.task_items(completed);

-- ============================================================
-- LEADERBOARDS
-- ============================================================
-- One row per user — upserted whenever a task item is completed.
-- total_completed = lifetime count of completed task items.
CREATE TABLE IF NOT EXISTS public.leaderboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    total_completed INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Everyone can read the leaderboard (public ranking)
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON public.leaderboards;
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboards
    FOR SELECT USING (true);

-- Only the system (via trigger) inserts/updates — users cannot modify directly
DROP POLICY IF EXISTS "Users can insert own leaderboard row" ON public.leaderboards;
CREATE POLICY "Users can insert own leaderboard row" ON public.leaderboards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own leaderboard row" ON public.leaderboards;
CREATE POLICY "Users can update own leaderboard row" ON public.leaderboards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_leaderboards_user_id ON public.leaderboards(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_total ON public.leaderboards(total_completed DESC);

-- ============================================================
-- TRIGGER: keep leaderboard in sync when task_items change
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_leaderboard()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_count INTEGER;
BEGIN
    -- Determine which task_item row changed
    IF TG_OP = 'DELETE' THEN
        SELECT tasks.user_id INTO v_user_id
        FROM public.tasks WHERE tasks.id = OLD.task_id;
    ELSE
        SELECT tasks.user_id INTO v_user_id
        FROM public.tasks WHERE tasks.id = NEW.task_id;
    END IF;

    -- Count ALL completed items for this user across all tasks
    SELECT COUNT(*) INTO v_count
    FROM public.task_items ti
    JOIN public.tasks t ON t.id = ti.task_id
    WHERE t.user_id = v_user_id
      AND ti.completed = TRUE;

    -- Upsert into leaderboards
    INSERT INTO public.leaderboards (user_id, total_completed, updated_at)
    VALUES (v_user_id, v_count, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_completed = EXCLUDED.total_completed,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_task_item_change ON public.task_items;
CREATE TRIGGER on_task_item_change
    AFTER INSERT OR UPDATE OR DELETE ON public.task_items
    FOR EACH ROW EXECUTE FUNCTION public.sync_leaderboard();

-- ============================================================
-- TRIGGER: auto-set completed_at when item is toggled
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_task_item_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        NEW.completed_at = NOW();
    ELSIF NEW.completed = FALSE THEN
        NEW.completed_at = NULL;
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_task_item_update ON public.task_items;
CREATE TRIGGER on_task_item_update
    BEFORE UPDATE ON public.task_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_task_item_completion();

-- ============================================================
-- STORAGE: avatars bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Create new policies
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');