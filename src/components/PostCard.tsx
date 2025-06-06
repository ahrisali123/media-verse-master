
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, Video } from "lucide-react";

// Define the PostCardProps interface
export interface PostCardProps {
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
}

export function PostCard({
  content,
  author,
  authorImage,
  date,
  platform,
  status,
  image,
  video,
  isReel,
  engagement,
}: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={authorImage} alt={author} />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{author}</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <span>{date}</span>
              {status === "scheduled" && (
                <Badge variant="secondary">Scheduled</Badge>
              )}
              {status === "draft" && <Badge variant="outline">Draft</Badge>}
              {isReel && (
                <Badge variant="destructive">Reel</Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        {video ? (
          <div className="mt-4 relative">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Video Thumbnail"
                  className="mt-4 rounded-md w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-2" />
                </div>
              </div>
            ) : (
              <video 
                src={video}
                controls
                className="mt-4 rounded-md w-full h-auto"
                poster={image}
              />
            )}
          </div>
        ) : image ? (
          <img
            src={image}
            alt="Post Image"
            className="mt-4 rounded-md w-full h-auto"
          />
        ) : null}
      </CardContent>
      {engagement && status === "published" && (
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{engagement.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{engagement.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
              <span>{engagement.shares}</span>
            </div>
          </div>
          <div>
            <Badge className="capitalize">{platform}</Badge>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
