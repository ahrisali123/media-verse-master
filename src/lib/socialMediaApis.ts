import { supabase } from "./supabase";

// Social media platform API interfaces
interface FacebookPost {
  message: string;
  link?: string;
  image?: string;
}

interface InstagramPost {
  caption: string;
  image_url: string;
}

// Social media API service
export const socialMediaAPI = {
  // Facebook API functions - using real Facebook Graph API
  facebook: {
    getPosts: async (accessToken: string) => {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/me/feed?fields=id,message,created_time,attachments,insights.metric(post_impressions,post_reactions_by_type_total,post_clicks)&access_token=${accessToken}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to fetch Facebook posts");
        }
        
        const data = await response.json();
        
        const posts = data.data.map((post: any) => ({
          id: post.id,
          message: post.message || "",
          created_time: post.created_time,
          media_url: post.attachments?.data[0]?.media?.image?.src || null,
          video_url: post.attachments?.data[0]?.media?.source || null,
          likes: post.insights?.data?.find((i: any) => i.name === "post_reactions_by_type_total")?.values[0]?.value?.like || 0,
          comments: 0, // Facebook Graph API doesn't directly provide comment count in this endpoint
          shares: 0, // Facebook Graph API doesn't directly provide share count in this endpoint
        }));
        
        return { posts, error: null };
      } catch (error: any) {
        console.error("Facebook API error:", error);
        return { posts: null, error: error.message };
      }
    },
    
    createPost: async (accessToken: string, post: FacebookPost) => {
      try {
        const params = new URLSearchParams();
        params.append('message', post.message);
        
        if (post.link) {
          params.append('link', post.link);
        }
        
        const response = await fetch(
          `https://graph.facebook.com/v18.0/me/feed?access_token=${accessToken}`,
          {
            method: 'POST',
            body: params
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to create Facebook post");
        }
        
        const data = await response.json();
        return {
          success: true,
          postId: data.id,
          error: null
        };
      } catch (error: any) {
        console.error("Facebook API error:", error);
        return { success: false, postId: null, error: error.message };
      }
    },
    
    getAnalytics: async (accessToken: string, postId: string) => {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${postId}/insights?metric=post_impressions,post_reactions_by_type_total,post_clicks&access_token=${accessToken}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to fetch Facebook analytics");
        }
        
        const data = await response.json();
        
        const impressions = data.data.find((item: any) => item.name === 'post_impressions')?.values[0]?.value || 0;
        const clicks = data.data.find((item: any) => item.name === 'post_clicks')?.values[0]?.value || 0;
        const reactions = data.data.find((item: any) => item.name === 'post_reactions_by_type_total')?.values[0]?.value || {};
        
        const likes = reactions.like || 0;
        
        return {
          analytics: {
            impressions,
            reach: Math.round(impressions * 0.8), // Estimated reach based on impressions
            engagement: likes + clicks,
            engagement_rate: impressions > 0 ? ((likes + clicks) / impressions) : 0,
            clicks
          },
          error: null
        };
      } catch (error: any) {
        console.error("Facebook API error:", error);
        return { analytics: null, error: error.message };
      }
    }
  },
  
  // Instagram API functions - using real Instagram Graph API
  instagram: {
    getPosts: async (accessToken: string) => {
      try {
        // First, get user's Instagram Business Account ID
        const userResponse = await fetch(
          `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
        );
        
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error?.message || "Failed to fetch Instagram account");
        }
        
        const userData = await userResponse.json();
        const instagramAccountId = userData.data[0]?.instagram_business_account?.id;
        
        if (!instagramAccountId) {
          throw new Error("No Instagram Business Account connected to this Facebook Page");
        }
        
        // Fetch media from Instagram
        const mediaResponse = await fetch(
          `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{media_url,media_type}&access_token=${accessToken}`
        );
        
        if (!mediaResponse.ok) {
          const errorData = await mediaResponse.json();
          throw new Error(errorData.error?.message || "Failed to fetch Instagram posts");
        }
        
        const mediaData = await mediaResponse.json();
        
        const posts = mediaData.data.map((post: any) => ({
          id: post.id,
          caption: post.caption || "",
          media_url: post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
          video_url: post.media_type === "VIDEO" ? post.media_url : null,
          media_type: post.media_type,
          permalink: post.permalink,
          timestamp: post.timestamp,
          likes: post.like_count || 0,
          comments: post.comments_count || 0,
          children: post.children?.data?.map((child: any) => ({
            media_url: child.media_url,
            media_type: child.media_type
          }))
        }));
        
        return {
          posts,
          error: null
        };
      } catch (error: any) {
        console.error("Instagram API error:", error);
        return { posts: null, error: error.message };
      }
    },
    
    createPost: async (accessToken: string, post: InstagramPost) => {
      try {
        // Step 1: Get Instagram Business Account ID
        const userResponse = await fetch(
          `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
        );
        
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error?.message || "Failed to fetch Instagram account");
        }
        
        const userData = await userResponse.json();
        const instagramAccountId = userData.data[0]?.instagram_business_account?.id;
        
        if (!instagramAccountId) {
          throw new Error("No Instagram Business Account connected to this Facebook Page");
        }
        
        // Step 2: Create container
        const containerParams = new URLSearchParams();
        containerParams.append('image_url', post.image_url);
        containerParams.append('caption', post.caption);
        
        const containerResponse = await fetch(
          `https://graph.facebook.com/v18.0/${instagramAccountId}/media?access_token=${accessToken}`,
          {
            method: 'POST',
            body: containerParams
          }
        );
        
        if (!containerResponse.ok) {
          const errorData = await containerResponse.json();
          throw new Error(errorData.error?.message || "Failed to create Instagram container");
        }
        
        const containerData = await containerResponse.json();
        const containerId = containerData.id;
        
        // Step 3: Publish container
        const publishParams = new URLSearchParams();
        publishParams.append('creation_id', containerId);
        
        const publishResponse = await fetch(
          `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish?access_token=${accessToken}`,
          {
            method: 'POST',
            body: publishParams
          }
        );
        
        if (!publishResponse.ok) {
          const errorData = await publishResponse.json();
          throw new Error(errorData.error?.message || "Failed to publish Instagram post");
        }
        
        const publishData = await publishResponse.json();
        
        return {
          success: true,
          postId: publishData.id,
          error: null
        };
      } catch (error: any) {
        console.error("Instagram API error:", error);
        return { success: false, postId: null, error: error.message };
      }
    },
    
    getAnalytics: async (accessToken: string, postId: string) => {
      try {
        // Get insights for the media
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${postId}/insights?metric=impressions,reach,engagement,saved&access_token=${accessToken}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to fetch Instagram analytics");
        }
        
        const data = await response.json();
        
        const impressions = data.data.find((item: any) => item.name === 'impressions')?.values[0]?.value || 0;
        const reach = data.data.find((item: any) => item.name === 'reach')?.values[0]?.value || 0;
        const engagement = data.data.find((item: any) => item.name === 'engagement')?.values[0]?.value || 0;
        const saves = data.data.find((item: any) => item.name === 'saved')?.values[0]?.value || 0;
        
        return {
          analytics: {
            impressions,
            reach,
            engagement,
            profile_visits: Math.round(engagement * 0.2), // Estimated based on engagement
            follows: Math.round(engagement * 0.05), // Estimated based on engagement
            saves
          },
          error: null
        };
      } catch (error: any) {
        console.error("Instagram API error:", error);
        return { analytics: null, error: error.message };
      }
    }
  },
  
  // LinkedIn and TikTok APIs are left as placeholders
  linkedin: {
    getPosts: async (accessToken: string) => {
      try {
        // This would use the LinkedIn API in production
        return {
          posts: [
            { id: "li123", content: "LinkedIn post 1", created_time: new Date().toISOString(), likes: 67, comments: 12, shares: 5 },
            { id: "li124", content: "LinkedIn post 2", created_time: new Date(Date.now() - 86400000).toISOString(), likes: 42, comments: 8, shares: 3 }
          ],
          error: null
        };
      } catch (error: any) {
        return { posts: null, error: error.message };
      }
    },
    
    createPost: async (accessToken: string, post: any) => {
      try {
        // This would use the LinkedIn API in production
        return {
          success: true,
          postId: `li-${Date.now()}`,
          error: null
        };
      } catch (error: any) {
        return { success: false, postId: null, error: error.message };
      }
    },
    
    getAnalytics: async (accessToken: string, postId: string) => {
      try {
        // This would use the LinkedIn API in production
        return {
          analytics: {
            impressions: 1532,
            clicks: 87,
            engagement: 93,
            shares: 12,
            likes: 67
          },
          error: null
        };
      } catch (error: any) {
        return { analytics: null, error: error.message };
      }
    }
  },
  
  tiktok: {
    getVideos: async (accessToken: string) => {
      try {
        // This would use the TikTok API in production
        return {
          videos: [
            { id: "tk123", description: "TikTok video 1", video_url: "https://example.com/video1.mp4", created_time: new Date().toISOString(), views: 12453, likes: 4213, comments: 342, shares: 523 },
            { id: "tk124", description: "TikTok video 2", video_url: "https://example.com/video2.mp4", created_time: new Date(Date.now() - 86400000).toISOString(), views: 8543, likes: 2341, comments: 154, shares: 321 }
          ],
          error: null
        };
      } catch (error: any) {
        return { videos: null, error: error.message };
      }
    },
    
    createVideo: async (accessToken: string, post: any) => {
      try {
        // This would use the TikTok API in production
        return {
          success: true,
          videoId: `tk-${Date.now()}`,
          error: null
        };
      } catch (error: any) {
        return { success: false, videoId: null, error: error.message };
      }
    },
    
    getAnalytics: async (accessToken: string, videoId: string) => {
      try {
        // This would use the TikTok API in production
        return {
          analytics: {
            views: 15342,
            likes: 4231,
            comments: 312,
            shares: 621,
            average_watch_time: 14.3,
            completion_rate: 0.64
          },
          error: null
        };
      } catch (error: any) {
        return { analytics: null, error: error.message };
      }
    }
  }
};

// Social account connection and management
export const socialAccountsManager = {
  // Connect a social media account
  connectAccount: async (userId: string, platform: string, accessToken: string, username: string) => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .upsert({
          profile_id: userId,
          platform,
          username,
          access_token: accessToken,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      return { success: true, account: data[0], error: null };
    } catch (error: any) {
      return { success: false, account: null, error: error.message };
    }
  },
  
  // Get all accounts for a user
  getUserAccounts: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('profile_id', userId);
        
      if (error) {
        throw error;
      }
      
      return { accounts: data, error: null };
    } catch (error: any) {
      return { accounts: [], error: error.message };
    }
  },
  
  // Disconnect a social media account
  disconnectAccount: async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId);
        
      if (error) {
        throw error;
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// Analytics data aggregator
export const analyticsAggregator = {
  // Get combined analytics across platforms
  getCombinedAnalytics: async (userId: string, daysAgo = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      
      const { data, error } = await supabase
        .rpc('get_engagement_by_platform', { 
          p_profile_id: userId,
          p_start_date: startDate.toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      return { analytics: data, error: null };
    } catch (error: any) {
      return { analytics: [], error: error.message };
    }
  },
  
  // Get analytics for individual posts
  getPostAnalytics: async (postIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('post_engagements')
        .select('*')
        .in('post_id', postIds)
        .order('recorded_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return { analytics: data, error: null };
    } catch (error: any) {
      return { analytics: [], error: error.message };
    }
  },
  
  // Get best posting times
  getBestPostingTimes: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_best_posting_times', { 
          p_profile_id: userId
        });
      
      if (error) {
        throw error;
      }
      
      return { times: data, error: null };
    } catch (error: any) {
      return { times: [], error: error.message };
    }
  }
};
