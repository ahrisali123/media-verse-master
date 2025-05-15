
import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { Analytics } from "./Analytics";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { toast } from "@/components/ui/sonner";

type PostType = {
  id: string;
  content: string;
  author: string;
  authorImage?: string;
  date: string;
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
  status: "published" | "scheduled" | "draft";
  image?: string;
  video?: string;
  isReel?: boolean;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
};

export function Dashboard() {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const { accounts, loadUserAccounts, getPosts, isLoading: isSocialLoading } = useSocialMedia();
  const [recentPosts, setRecentPosts] = useState<PostType[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<PostType[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    console.log("Auth state:", { user, profile, isAuthLoading });
    if (user) {
      loadUserAccounts();
    }
  }, [user]);

  useEffect(() => {
    console.log("Social accounts:", { accounts, isSocialLoading });
    const fetchPosts = async () => {
      if (!user || accounts.length === 0) return;
      
      setIsLoadingPosts(true);
      const allPosts: PostType[] = [];

      try {
        for (const account of accounts) {
          if (account.platform === 'facebook' || account.platform === 'instagram') {
            console.log(`Fetching posts for ${account.platform}...`);
            const { posts } = await getPosts(account.platform, account.access_token);
            console.log(`Received ${posts?.length || 0} posts from ${account.platform}`);
            
            if (posts && posts.length) {
              const formattedPosts = posts.map((post: any) => ({
                id: post.id,
                content: post.message || post.caption || "",
                author: account.username,
                authorImage: profile?.avatar_url || "",
                date: new Date(post.created_time || post.timestamp).toLocaleString(),
                platform: account.platform as "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok",
                status: "published" as const,
                image: post.media_url || undefined,
                video: post.video_url || undefined,
                isReel: account.platform === 'instagram' && (post.media_type === 'REEL' || post.media_type === 'VIDEO'),
                engagement: {
                  likes: post.likes || 0,
                  comments: post.comments || 0,
                  shares: 0,
                }
              }));
              
              allPosts.push(...formattedPosts);
            }
          }
        }
        
        // Sort posts by date (newest first)
        allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setRecentPosts(allPosts);
        setIsLoadingPosts(false);
        
        // In a real app, we would fetch upcoming scheduled posts from the database
        setUpcomingPosts([]);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts. Please try again later.");
        setIsLoadingPosts(false);
      }
    };
    
    fetchPosts();
  }, [accounts, user]);

  const renderPostsSection = (title: string, posts: PostType[], isLoading: boolean) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="border rounded-md p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-[200px] w-full rounded-md" />
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              content={post.content}
              author={post.author}
              authorImage={post.authorImage}
              date={post.date}
              platform={post.platform}
              status={post.status}
              image={post.image}
              video={post.video}
              isReel={post.isReel}
              engagement={post.engagement}
            />
          ))
        ) : (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            No {title.toLowerCase()} found. Connect your social media accounts to see your posts here.
          </div>
        )}
      </div>
    </div>
  );

  // Show appropriate loading or error states
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
        <p>You need to be logged in to view your dashboard.</p>
        <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Analytics />
      
      <div className="grid gap-6 md:grid-cols-2">
        {renderPostsSection("Recent Posts", recentPosts, isLoadingPosts)}
        {renderPostsSection("Upcoming Posts", upcomingPosts, isLoadingPosts)}
      </div>

      {isSocialLoading && accounts.length === 0 && (
        <div className="text-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your social media accounts...</p>
        </div>
      )}

      {!isSocialLoading && accounts.length === 0 && (
        <div className="text-center p-4 border rounded-md my-8">
          <p className="mb-4">No social media accounts connected. Connect accounts to view posts.</p>
          <Button onClick={() => window.location.href = "/settings"}>Connect Accounts</Button>
        </div>
      )}
    </div>
  );
}
