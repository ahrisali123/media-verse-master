
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WandSparkles } from "lucide-react";
import { ContentAssistant } from "./ContentAssistant";
import { BestTimeToPost } from "./BestTimeToPost";
import { PostTypeSelector } from "./post-creator/PostTypeSelector";
import { PlatformSelector } from "./post-creator/PlatformSelector";
import { PostScheduler } from "./post-creator/PostScheduler";
import { MediaUpload } from "./post-creator/MediaUpload";
import { PostPreview } from "./post-creator/PostPreview";
import { usePosts } from "@/hooks/usePosts";
import { toast } from "@/components/ui/sonner";

export function PostCreator() {
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"]);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [video, setVideo] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [postType, setPostType] = useState<"image" | "video" | "reel">("image");
  const [activeTab, setActiveTab] = useState("create");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  
  const { createPost, isUploading } = usePosts();

  const handleSubmit = () => {
    // Create a Date object combining the selected date and time
    let scheduleTime: Date | undefined = undefined;
    
    if (selectedDate) {
      scheduleTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      scheduleTime.setHours(hours, minutes);
    }
    
    createPost({
      content,
      platforms: selectedPlatforms,
      scheduleTime,
      image: imageFile || undefined,
      video: videoFile || undefined
    });
    
    // Reset form after submission
    setContent("");
    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setImage("");
    setVideo("");
    setImageFile(null);
    setVideoFile(null);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    if (file.type.includes("image")) {
      setImageFile(file);
      // Create a temporary preview URL
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setVideo("");
      setVideoFile(null);
    } else if (file.type.includes("video")) {
      setVideoFile(file);
      // For video, we'd typically show a thumbnail, but for simplicity:
      const videoUrl = URL.createObjectURL(file);
      setVideo(videoUrl);
      // Set a placeholder image for the video thumbnail
      setImage("https://source.unsplash.com/random/800x600/?video-thumbnail");
    }
  };

  return (
    <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
        <TabsTrigger value="create">Create Post</TabsTrigger>
        <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        <TabsTrigger value="timing">Best Timing</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <PostTypeSelector postType={postType} setPostType={setPostType} />
                
                <Textarea 
                  placeholder="What's on your mind?"
                  className="min-h-[120px] resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <PlatformSelector 
                    selectedPlatforms={selectedPlatforms}
                    setSelectedPlatforms={setSelectedPlatforms}
                  />
                  
                  <PostScheduler
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label>Media</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowAiAssistant(true)}
                      className="h-8 px-2 text-xs"
                    >
                      <WandSparkles className="mr-1 h-3 w-3" />
                      AI Assist
                    </Button>
                  </div>
                  <MediaUpload
                    postType={postType}
                    image={image}
                    video={video}
                    setImage={setImage}
                    setVideo={setVideo}
                    isUploading={isUploading}
                    setIsUploading={() => {}}
                    onFileChange={handleFileChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("ai")} 
                  >
                    <WandSparkles className="mr-2 h-4 w-4" />
                    AI Assist
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        createPost({
                          content,
                          platforms: selectedPlatforms,
                          image: imageFile || undefined,
                          video: videoFile || undefined
                        });
                        toast.success("Post saved as draft");
                      }}
                    >
                      Save as Draft
                    </Button>
                    <Button onClick={handleSubmit} disabled={isUploading}>
                      {selectedDate ? "Schedule Post" : "Post Now"}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <PostPreview content={content} image={image} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="ai" className="mt-0">
        <ContentAssistant />
      </TabsContent>

      <TabsContent value="timing" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Optimal Posting Times</CardTitle>
          </CardHeader>
          <CardContent>
            <BestTimeToPost />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
