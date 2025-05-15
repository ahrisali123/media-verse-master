
import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { Analytics } from "./Analytics";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { user, profile } = useAuth();
  const { accounts, loadUserAccounts, getPosts, isLoading } = useSocialMedia();
  const [recentPosts, setRecentPosts] = useState<PostType[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<PostType[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    loadUserAccounts();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (accounts.length === 0) return;
      
      setIsLoadingPosts(true);
      const allPosts: PostType[] = [];

      for (const account of accounts) {
        if (account.platform === 'facebook' || account.platform === 'instagram') {
          const { posts } = await getPosts(account.platform, account.access_token);
          
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
      // For now, we'll leave this empty as we've removed hardcoded data
      setUpcomingPosts([]);
    };
    
    fetchPosts();
  }, [accounts]);

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

  return (
    <div className="space-y-8">
      <Analytics />
      
      <div className="grid gap-6 md:grid-cols-2">
        {renderPostsSection("Recent Posts", recentPosts, isLoadingPosts)}
        {renderPostsSection("Upcoming Posts", upcomingPosts, isLoadingPosts)}
      </div>
    </div>
  );
}
