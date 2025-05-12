
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

export function PostCreator() {
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"]);
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [postType, setPostType] = useState<"image" | "video" | "reel">("image");
  const [activeTab, setActiveTab] = useState("create");

  const handleSubmit = () => {
    // Logic for scheduling or posting would go here
    console.log({
      content,
      date: selectedDate,
      time: selectedTime,
      platforms: selectedPlatforms,
      image,
      video,
      postType
    });
    alert("Post scheduled successfully!");
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
                    setIsUploading={setIsUploading}
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
                    <Button variant="outline">Save as Draft</Button>
                    <Button onClick={handleSubmit}>Schedule Post</Button>
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
