
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
import { Camera, Link, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostCreator() {
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"]);
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file upload
      setTimeout(() => {
        setImage("https://source.unsplash.com/random/800x600/?nature");
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
      image
    });
    alert("Post scheduled successfully!");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
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
              <Label>Media</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input 
                    type="file" 
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Label 
                    htmlFor="image-upload" 
                    className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <Camera size={18} />
                    <span>Upload image</span>
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
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => setImage("")}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex justify-between w-full">
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={handleSubmit}>Schedule Post</Button>
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
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
