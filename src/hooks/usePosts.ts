
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post, postsAPI, storageAPI } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export const usePosts = (status?: Post['status']) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Get posts query
  const {
    data: posts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['posts', user?.id, status],
    queryFn: async () => {
      if (!user?.id) return [];
      const { posts, error } = await postsAPI.getPostsByProfileId(user.id, status);
      if (error) throw error;
      return posts || [];
    },
    enabled: !!user,
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async ({ 
      content, 
      platforms, 
      scheduleTime, 
      image,
      video
    }: {
      content: string;
      platforms: string[];
      scheduleTime?: Date;
      image?: File;
      video?: File;
    }) => {
      if (!user) throw new Error('You must be logged in');
      setIsUploading(true);

      try {
        let imageUrl = undefined;
        let videoUrl = undefined;
        
        // Upload image if provided
        if (image) {
          const { path, error } = await storageAPI.uploadImage(image, user.id);
          if (error) throw error;
          imageUrl = path;
        }
        
        // Upload video if provided
        if (video) {
          const { path, error } = await storageAPI.uploadVideo(video, user.id);
          if (error) throw error;
          videoUrl = path;
        }
        
        // Determine post status
        const status = scheduleTime ? 'scheduled' : 'draft';
        
        // Create the post
        const { data, error } = await postsAPI.createPost({
          profile_id: user.id,
          content,
          image_url: imageUrl,
          video_url: videoUrl,
          platforms,
          schedule_time: scheduleTime?.toISOString(),
          status,
          created_at: new Date().toISOString(),
        });
        
        if (error) throw error;
        return data;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create post: ${error.message}`);
    }
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: {
      id: string;
      updates: Partial<Post>;
    }) => {
      const { data, error } = await postsAPI.updatePost(id, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update post: ${error.message}`);
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await postsAPI.deletePost(id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    }
  });

  return {
    posts,
    isLoading,
    isUploading,
    error,
    refetch,
    createPost: createPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
  };
};
