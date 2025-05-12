
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";

const PRESET_PROMPTS = [
  "Generate a caption for a new product launch",
  "Create a motivational quote post",
  "Suggest hashtags for a lifestyle post",
  "Write a customer testimonial highlight",
  "Create a holiday promotion post"
];

const TRENDING_HASHTAGS = {
  fashion: ["#OOTD", "#StyleInspo", "#FashionWeek", "#TrendAlert", "#StyleTips"],
  food: ["#Foodie", "#FoodPorn", "#Delicious", "#ChefMode", "#Yummy"],
  travel: ["#Wanderlust", "#TravelGram", "#Adventure", "#Explore", "#TravelTips"],
  fitness: ["#FitnessGoals", "#WorkoutMotivation", "#HealthyLifestyle", "#FitFam", "#Workout"],
  beauty: ["#BeautyTips", "#SkincareTips", "#MakeupInspo", "#GlowUp", "#BeautyRoutine"],
  business: ["#Entrepreneur", "#SmallBusiness", "#BusinessTips", "#Success", "#Motivation"],
  technology: ["#TechNews", "#Innovation", "#DigitalTransformation", "#AI", "#FutureTech"]
};

export function ContentAssistant() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState("fashion");
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("caption");

  const handleGenerate = () => {
    if (!prompt) return;
    
    setGenerating(true);
    setResult("");
    
    // Simulate API call for content generation
    setTimeout(() => {
      let generatedContent = "";
      
      if (contentType === "caption") {
        generatedContent = `✨ ${prompt.includes("product") ? "Introducing our newest addition to the family! We're thrilled to finally share this with you all. It's been months in the making, and we're so proud of the result." : "Embracing the journey and loving every moment. Sometimes the best memories are made when we step outside our comfort zone and try something new."} #NewBeginnings #Excited`;
      } else if (contentType === "hashtags") {
        const tags = [...TRENDING_HASHTAGS[category as keyof typeof TRENDING_HASHTAGS].slice(0, 5)];
        if (platform === "instagram") {
          tags.push("#Instagram", "#InstaDaily", "#InstaGood");
        } else if (platform === "tiktok") {
          tags.push("#TikTok", "#TikTokTrend", "#ForYouPage", "#FYP");
        }
        generatedContent = tags.join(" ");
      } else if (contentType === "ideas") {
        generatedContent = `1. Share a behind-the-scenes look at your process
2. Create a "day in the life" style post
3. Do a Q&A session with your followers
4. Highlight customer testimonials
5. Share industry tips and tricks`;
      }
      
      setResult(generatedContent);
      setGenerating(false);
    }, 2000);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSelectPrompt = (preset: string) => {
    setPrompt(preset);
  };

  const hashtags = TRENDING_HASHTAGS[category as keyof typeof TRENDING_HASHTAGS] || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Content Assistant</CardTitle>
        <CardDescription>Generate content ideas, captions, and hashtags</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtag Suggestions</TabsTrigger>
            <TabsTrigger value="trends">Trending Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
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
                <div>
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caption">Caption</SelectItem>
                      <SelectItem value="hashtags">Hashtags</SelectItem>
                      <SelectItem value="ideas">Content Ideas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea 
                  id="prompt"
                  placeholder="Describe what you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-24"
                />
              </div>
              
              <div>
                <Label>Quick Prompts</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRESET_PROMPTS.map((preset, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleSelectPrompt(preset)}
                    >
                      {preset}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={generating || !prompt}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Generating...
                  </>
                ) : "Generate Content"}
              </Button>
              
              {result && (
                <div className="mt-4 space-y-2">
                  <Label>Generated Content</Label>
                  <div className="p-4 bg-accent rounded-md whitespace-pre-line">
                    {result}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Regenerate</Button>
                    <Button size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Use This
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="hashtags" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Popular Hashtags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hashtags.map((tag, i) => (
                    <Badge 
                      key={i} 
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom-tags">Custom Hashtags</Label>
                <div className="flex gap-2">
                  <Input 
                    id="custom-tags" 
                    placeholder="Enter a custom hashtag..."
                  />
                  <Button variant="outline">Add</Button>
                </div>
              </div>
              
              {selectedTags.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Selected Hashtags</Label>
                  <div className="p-4 bg-accent rounded-md">
                    {selectedTags.join(" ")}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Clear All</Button>
                    <Button size="sm">Copy All</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="trend-platform">Platform</Label>
                <Select defaultValue="instagram">
                  <SelectTrigger id="trend-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Trending Topics</Label>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Summer Fashion Essentials</h4>
                          <p className="text-sm text-muted-foreground">
                            +120% engagement this week
                          </p>
                        </div>
                        <Button size="sm">Use</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Behind the Scenes Content</h4>
                          <p className="text-sm text-muted-foreground">
                            +85% engagement this week
                          </p>
                        </div>
                        <Button size="sm">Use</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Quick Tips & Tricks</h4>
                          <p className="text-sm text-muted-foreground">
                            +64% engagement this week
                          </p>
                        </div>
                        <Button size="sm">Use</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Day in the Life</h4>
                          <p className="text-sm text-muted-foreground">
                            +42% engagement this week
                          </p>
                        </div>
                        <Button size="sm">Use</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="text-sm text-muted-foreground">
          AI-generated suggestions are based on current trends and your account's performance data.
        </div>
      </CardFooter>
    </Card>
  );
}
