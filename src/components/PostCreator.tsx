
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { PostCard } from "./PostCard";
import { Camera, Link, Calendar as CalendarIcon, Video, MagicWand, TimerIcon, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentAssistant } from "./ContentAssistant";
import { BestTimeToPost } from "./BestTimeToPost";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file upload
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
  };

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
                
                <Textarea 
                  placeholder="What's on your mind?"
                  className="min-h-[120px] resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platforms">Platforms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Input 
                        type="time" 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Media</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowAiAssistant(true)}
                      className="h-8 px-2 text-xs"
                    >
                      <MagicWand className="mr-1 h-3 w-3" />
                      AI Assist
                    </Button>
                  </div>
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
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("ai")} 
                  >
                    <MagicWand className="mr-2 h-4 w-4" />
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="instagram" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="instagram" className="m-0">
                    <PostCard
                      content={content || "Your post preview will appear here..."}
                      author="Your Account"
                      date="Just now"
                      platform="instagram"
                      status="draft"
                      image={image || undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="facebook" className="m-0">
                    <PostCard
                      content={content || "Your post preview will appear here..."}
                      author="Your Account"
                      date="Just now"
                      platform="facebook"
                      status="draft"
                      image={image || undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="twitter" className="m-0">
                    <PostCard
                      content={content || "Your post preview will appear here..."}
                      author="Your Account"
                      date="Just now"
                      platform="twitter"
                      status="draft"
                      image={image || undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="linkedin" className="m-0">
                    <PostCard
                      content={content || "Your post preview will appear here..."}
                      author="Your Account"
                      date="Just now"
                      platform="linkedin"
                      status="draft"
                      image={image || undefined}
                    />
                  </TabsContent>
                  
                  <TabsContent value="tiktok" className="m-0">
                    <PostCard
                      content={content || "Your post preview will appear here..."}
                      author="Your Account"
                      date="Just now"
                      platform="instagram" // Using instagram as base styling for now
                      status="draft"
                      image={image || undefined}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
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
