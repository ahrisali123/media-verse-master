
import { PostCard } from "../PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PostPreviewProps {
  content: string;
  image?: string;
}

export function PostPreview({ content, image }: PostPreviewProps) {
  return (
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
              platform="tiktok" // Changed from instagram to tiktok
              status="draft"
              image={image || undefined}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
