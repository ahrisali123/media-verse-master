
import { Button } from "@/components/ui/button";
import { Camera, Video } from "lucide-react";

interface PostTypeSelectorProps {
  postType: "image" | "video" | "reel";
  setPostType: (type: "image" | "video" | "reel") => void;
}

export function PostTypeSelector({ postType, setPostType }: PostTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant={postType === "image" ? "default" : "outline"} 
        onClick={() => setPostType("image")}
        className="flex-1"
      >
        <Camera className="mr-2 h-4 w-4" />
        Image
      </Button>
      <Button 
        variant={postType === "video" ? "default" : "outline"} 
        onClick={() => setPostType("video")}
        className="flex-1"
      >
        <Video className="mr-2 h-4 w-4" />
        Video
      </Button>
      <Button 
        variant={postType === "reel" ? "default" : "outline"} 
        onClick={() => setPostType("reel")}
        className="flex-1"
      >
        <Video className="mr-2 h-4 w-4" />
        Reel
      </Button>
    </div>
  );
}
