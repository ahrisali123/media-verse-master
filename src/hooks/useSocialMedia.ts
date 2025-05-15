import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { socialMediaAPI, socialAccountsManager, analyticsAggregator } from '@/lib/socialMediaApis';
import { toast } from '@/components/ui/sonner';

export const useSocialMedia = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Load user's connected social media accounts
  const loadUserAccounts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { accounts, error } = await socialAccountsManager.getUserAccounts(user.id);
      
      if (error) {
        toast.error(`Failed to load social accounts: ${error}`);
        return;
      }
      
      setAccounts(accounts);
    } catch (error: any) {
      toast.error(`Error loading social accounts: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect a new social media account
  const connectAccount = async (platform: string, accessToken: string, username: string) => {
    if (!user) {
      toast.error('You must be logged in to connect social accounts');
      return { success: false, error: 'Not authenticated' };
    }
    
    setIsLoading(true);
    try {
      const { success, error } = await socialAccountsManager.connectAccount(
        user.id,
        platform,
        accessToken,
        username
      );
      
      if (error) {
        toast.error(`Failed to connect ${platform}: ${error}`);
        return { success: false, error };
      }
      
      toast.success(`Successfully connected ${platform} account`);
      await loadUserAccounts(); // Refresh accounts list
      return { success, error: null };
    } catch (error: any) {
      toast.error(`Error connecting ${platform}: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect a social media account
  const disconnectAccount = async (accountId: string, platform: string) => {
    setIsLoading(true);
    try {
      const { success, error } = await socialAccountsManager.disconnectAccount(accountId);
      
      if (error) {
        toast.error(`Failed to disconnect ${platform}: ${error}`);
        return { success: false };
      }
      
      toast.success(`Successfully disconnected ${platform} account`);
      await loadUserAccounts(); // Refresh accounts list
      return { success };
    } catch (error: any) {
      toast.error(`Error disconnecting ${platform}: ${error.message}`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Get posts from a specific platform
  const getPosts = async (platform: string, accessToken: string) => {
    setIsLoading(true);
    try {
      let result;
      
      switch (platform) {
        case 'facebook':
          result = await socialMediaAPI.facebook.getPosts(accessToken);
          break;
        case 'instagram':
          result = await socialMediaAPI.instagram.getPosts(accessToken);
          break;
        case 'linkedin':
          result = await socialMediaAPI.linkedin.getPosts(accessToken);
          break;
        case 'tiktok':
          result = await socialMediaAPI.tiktok.getVideos(accessToken);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      
      if (result.error) {
        toast.error(`Failed to fetch posts from ${platform}: ${result.error}`);
        return { posts: [] };
      }
      
      return { posts: result.posts || [] };
    } catch (error: any) {
      toast.error(`Error fetching posts from ${platform}: ${error.message}`);
      return { posts: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new post on a specific platform
  const createPost = async (platform: string, accessToken: string, postData: any) => {
    setIsLoading(true);
    try {
      let result;
      
      switch (platform) {
        case 'facebook':
          result = await socialMediaAPI.facebook.createPost(accessToken, postData);
          break;
        case 'instagram':
          result = await socialMediaAPI.instagram.createPost(accessToken, postData);
          break;
        case 'linkedin':
          result = await socialMediaAPI.linkedin.createPost(accessToken, postData);
          break;
        case 'tiktok':
          result = await socialMediaAPI.tiktok.createVideo(accessToken, postData);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      
      if (result.error) {
        toast.error(`Failed to create post on ${platform}: ${result.error}`);
        return { success: false };
      }
      
      toast.success(`Successfully posted to ${platform}`);
      return { success: true, postId: result.postId || result.videoId };
    } catch (error: any) {
      toast.error(`Error creating post on ${platform}: ${error.message}`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Get analytics for a specific post
  const getPostAnalytics = async (platform: string, accessToken: string, postId: string) => {
    setIsLoading(true);
    try {
      let result;
      
      switch (platform) {
        case 'facebook':
          result = await socialMediaAPI.facebook.getAnalytics(accessToken, postId);
          break;
        case 'instagram':
          result = await socialMediaAPI.instagram.getAnalytics(accessToken, postId);
          break;
        case 'linkedin':
          result = await socialMediaAPI.linkedin.getAnalytics(accessToken, postId);
          break;
        case 'tiktok':
          result = await socialMediaAPI.tiktok.getAnalytics(accessToken, postId);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      
      if (result.error) {
        toast.error(`Failed to fetch analytics from ${platform}: ${result.error}`);
        return { analytics: null };
      }
      
      return { analytics: result.analytics };
    } catch (error: any) {
      toast.error(`Error fetching analytics from ${platform}: ${error.message}`);
      return { analytics: null };
    } finally {
      setIsLoading(false);
    }
  };

  // Get combined analytics across all platforms
  const getCombinedAnalytics = async (daysAgo = 30) => {
    if (!user) return { analytics: [] };
    
    setIsLoading(true);
    try {
      const { analytics, error } = await analyticsAggregator.getCombinedAnalytics(user.id, daysAgo);
      
      if (error) {
        toast.error(`Failed to load combined analytics: ${error}`);
        return { analytics: [] };
      }
      
      return { analytics };
    } catch (error: any) {
      toast.error(`Error loading combined analytics: ${error.message}`);
      return { analytics: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Get best posting times
  const getBestPostingTimes = async () => {
    if (!user) return { times: [] };
    
    setIsLoading(true);
    try {
      const { times, error } = await analyticsAggregator.getBestPostingTimes(user.id);
      
      if (error) {
        toast.error(`Failed to load best posting times: ${error}`);
        return { times: [] };
      }
      
      return { times };
    } catch (error: any) {
      toast.error(`Error loading best posting times: ${error.message}`);
      return { times: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    accounts,
    loadUserAccounts,
    connectAccount,
    disconnectAccount,
    getPosts,
    createPost,
    getPostAnalytics,
    getCombinedAnalytics,
    getBestPostingTimes,
  };
};
