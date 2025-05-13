
import { Camera, Link, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MediaUploadProps {
  postType: "image" | "video" | "reel";
  image: string;
  video: string;
  setImage: (value: string) => void;
  setVideo: (value: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  onFileChange?: (file: File | null) => void;
}

export function MediaUpload({
  postType,
  image,
  video,
  setImage,
  setVideo,
  isUploading,
  setIsUploading,
  onFileChange
}: MediaUploadProps) {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      if (onFileChange) {
        onFileChange(file);
        setIsUploading(false);
      } else {
        // Fallback to the old behavior
        setTimeout(() => {
          if (file.type.includes("image")) {
            setImage("https://source.unsplash.com/random/800x600/?nature");
            setVideo("");
          } else if (file.type.includes("video")) {
            setVideo("https://example.com/video.mp4");
            setImage("https://source.unsplash.com/random/800x600/?video-thumbnail");
          }
          setIsUploading(false);
        }, 1500);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <Input 
            type="file" 
            id="media-upload"
            className="hidden"
            accept={postType === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
          />
          <Label 
            htmlFor="media-upload" 
            className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            {postType === "image" ? (
              <>
                <Camera size={18} />
                <span>Upload image</span>
              </>
            ) : (
              <>
                <Video size={18} />
                <span>Upload {postType}</span>
              </>
            )}
          </Label>
        </div>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Link size={18} />
          <span>Add URL</span>
        </Button>
      </div>
      
      {isUploading && (
        <div className="h-2 w-full bg-secondary rounded overflow-hidden">
          <div className="h-2 bg-brand-500 animate-pulse rounded" style={{ width: "60%" }} />
        </div>
      )}
      
      {image && (
        <div className="relative mt-2">
          <img 
            src={image} 
            alt="Preview" 
            className="rounded-md w-full h-auto max-h-[200px] object-cover"
          />
          {video && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
              <Video size={48} className="text-white opacity-70" />
            </div>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            className="absolute top-2 right-2"
            onClick={() => {
              setImage("");
              setVideo("");
              if (onFileChange) onFileChange(null);
            }}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
