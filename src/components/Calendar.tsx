
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { PostCard } from "./PostCard";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

// Sample scheduled posts data
const SCHEDULED_POSTS = [
  {
    id: 1,
    date: "2025-05-12T10:00:00",
    content: "Excited to announce our newest product line launching next week! Stay tuned for more details. #NewLaunch #ComingSoon",
    author: "Marketing Team",
    platform: "twitter" as const,
    status: "scheduled" as const
  },
  {
    id: 2,
    date: "2025-05-13T14:30:00",
    content: "Check out our latest blog post about social media trends in 2025! Link in bio. #SocialMedia #DigitalMarketing",
    author: "Content Team",
    platform: "instagram" as const,
    status: "scheduled" as const
  },
  {
    id: 3,
    date: "2025-05-15T09:00:00",
    content: "We're hiring! Join our dynamic team and help us grow. Check out open positions on our website. #Careers #JobOpening",
    author: "HR Department",
    platform: "linkedin" as const,
    status: "scheduled" as const
  },
  {
    id: 4,
    date: "2025-05-11T16:00:00",
    content: "Happy Mother's Day! Share how you're celebrating in the comments below. #MothersDay #Celebration",
    author: "Social Media Team",
    platform: "facebook" as const,
    status: "scheduled" as const
  }
];

export function ContentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Function to get posts for selected date
  const getPostsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    
    return SCHEDULED_POSTS.filter(post => {
      const postDate = new Date(post.date);
      return postDate.toDateString() === selectedDate.toDateString();
    });
  };
  
  // Function to get dates with scheduled posts
  const getHighlightedDates = () => {
    const dates = SCHEDULED_POSTS.map(post => new Date(post.date));
    return dates.reduce((acc, date) => {
      const dateString = date.toISOString().split('T')[0];
      acc[dateString] = { 
        hasPost: true
      };
      return acc;
    }, {} as Record<string, { hasPost: boolean }>);
  };
  
  const selectedDatePosts = getPostsForDate(date);
  const highlightedDates = getHighlightedDates();

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Content Calendar</CardTitle>
          <CardDescription>Schedule and manage your posts</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              highlighted: (date) => {
                const dateString = date.toISOString().split('T')[0];
                return !!highlightedDates[dateString];
              }
            }}
            modifiersStyles={{
              highlighted: { 
                backgroundColor: "rgba(132, 69, 255, 0.1)",
                fontWeight: "bold"
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scheduled Posts</CardTitle>
            <CardDescription>
              {date ? new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'Select a date'}
            </CardDescription>
          </div>
          {selectedDatePosts.length > 0 && (
            <Badge variant="outline" className="bg-brand-50 text-brand-800">
              {selectedDatePosts.length} posts
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {selectedDatePosts.length > 0 ? (
            <div className="space-y-4">
              {selectedDatePosts.map((post) => (
                <PostCard
                  key={post.id}
                  content={post.content}
                  author={post.author}
                  date={new Date(post.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  platform={post.platform}
                  status={post.status}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No posts scheduled for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
