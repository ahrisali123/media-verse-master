
declare module "@/components/PostCard" {
  export interface PostCardProps {
    content: string;
    author: string;
    authorImage?: string;
    date: string;
    platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
    status: "published" | "scheduled" | "draft";
    image?: string;
    engagement?: {
      likes: number;
      comments: number;
      shares: number;
    };
  }
}
