
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  image?: string;
  content: string;
  author: string;
  authorImage?: string;
  date: string;
  platform: "facebook" | "twitter" | "instagram" | "linkedin";
  status: "scheduled" | "published" | "draft";
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  className?: string;
}

export function PostCard({
  image,
  content,
  author,
  authorImage,
  date,
  platform,
  status,
  engagement,
  className
}: PostCardProps) {
  const platformColors = {
    facebook: "bg-blue-100 text-blue-800",
    twitter: "bg-sky-100 text-sky-800",
    instagram: "bg-pink-100 text-pink-800",
    linkedin: "bg-blue-100 text-blue-800"
  };
  
  const statusColors = {
    scheduled: "bg-amber-100 text-amber-800",
    published: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800"
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-0 flex flex-row items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={authorImage} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{author}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge className={platformColors[platform]} variant="secondary">{platform}</Badge>
          <Badge className={statusColors[status]} variant="secondary">{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm">{content}</p>
        
        {image && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img 
              src={image}
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </CardContent>
      
      {engagement && (
        <CardFooter className="p-4 pt-0 flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1 text-xs">
            <Heart size={14} />
            <span>{engagement.likes}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MessageSquare size={14} />
            <span>{engagement.comments}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Share size={14} />
            <span>{engagement.shares}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
