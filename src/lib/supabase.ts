import { createClient } from '@supabase/supabase-js';

// Get values from the generated Supabase client
const supabaseUrl = "https://skoosypvbcjjekhfjxrm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrb29zeXB2YmNqamVraGZqeHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDM0NTgsImV4cCI6MjA2MjcxOTQ1OH0.yKY9hXRok14AGXagNcFOqwJhUoKrC0fKhH-l1ZAWPk8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Profile = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
};

export type SocialAccount = {
  id: string;
  profile_id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  username: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  created_at: string;
};

export type Post = {
  id: string;
  profile_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  platforms: string[];
  schedule_time?: string;
  published_at?: string;
  status: 'draft' | 'scheduled' | 'published';
  created_at: string;
};

export type PostEngagement = {
  id: string;
  post_id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  likes: number;
  comments: number;
  shares: number;
  recorded_at: string;
};

// API functions for authentication
export const authAPI = {
  // Register a new user
  register: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Login an existing user
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Logout the current user
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get the current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },
};

// API functions for profiles
export const profilesAPI = {
  // Create or update a profile
  upsertProfile: async (profile: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select();
    return { data, error };
  },

  // Get a profile by ID
  getProfileById: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    return { profile: data, error };
  },
};

// API functions for social accounts
export const socialAccountsAPI = {
  // Connect a social media account
  connectAccount: async (account: Partial<SocialAccount>) => {
    const { data, error } = await supabase
      .from('social_accounts')
      .upsert(account)
      .select();
    return { data, error };
  },

  // Get all social accounts for a profile
  getAccountsByProfileId: async (profileId: string) => {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('profile_id', profileId);
    return { accounts: data, error };
  },

  // Delete a social account
  deleteAccount: async (id: string) => {
    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// API functions for posts
export const postsAPI = {
  // Create a new post
  createPost: async (post: Partial<Post>) => {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select();
    return { data, error };
  },

  // Update an existing post
  updatePost: async (id: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Get all posts for a profile
  getPostsByProfileId: async (profileId: string, status?: Post['status']) => {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('profile_id', profileId);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { posts: data, error };
  },

  // Get a post by ID
  getPostById: async (id: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    return { post: data, error };
  },

  // Delete a post
  deletePost: async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// API functions for media uploads
export const storageAPI = {
  // Upload an image
  uploadImage: async (file: File, profileId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file);
      
    if (error) return { path: null, error };
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
      
    return { path: urlData.publicUrl, error: null };
  },
  
  // Upload a video
  uploadVideo: async (file: File, profileId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file);
      
    if (error) return { path: null, error };
    
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);
      
    return { path: urlData.publicUrl, error: null };
  },
};

// API functions for analytics
export const analyticsAPI = {
  // Record engagement for a post
  recordEngagement: async (engagement: Partial<PostEngagement>) => {
    const { data, error } = await supabase
      .from('post_engagements')
      .insert(engagement)
      .select();
    return { data, error };
  },

  // Get engagement data for a post
  getEngagementByPostId: async (postId: string) => {
    const { data, error } = await supabase
      .from('post_engagements')
      .select('*')
      .eq('post_id', postId)
      .order('recorded_at', { ascending: false });
    return { engagements: data, error };
  },
  
  // Get aggregated engagement stats by platform for a profile
  getEngagementStatsByPlatform: async (profileId: string, daysAgo = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    const { data, error } = await supabase
      .rpc('get_engagement_by_platform', { 
        p_profile_id: profileId,
        p_start_date: startDate.toISOString()
      });
    
    return { stats: data, error };
  },
  
  // Get best posting times by platform
  getBestPostingTimes: async (profileId: string) => {
    const { data, error } = await supabase
      .rpc('get_best_posting_times', { 
        p_profile_id: profileId
      });
    
    return { times: data, error };
  }
};
