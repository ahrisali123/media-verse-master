
import { PostCard } from "./PostCard";
import { Analytics } from "./Analytics";

const recentPosts = [
  {
    id: 1,
    content: "Exciting news! Our summer collection just dropped. Check it out now on our website! #SummerFashion #NewArrivals",
    author: "Marketing Team",
    authorImage: "",
    date: "1 hour ago",
    platform: "instagram" as const,
    status: "published" as const,
    engagement: {
      likes: 245,
      comments: 32,
      shares: 18,
    }
  },
  {
    id: 2,
    content: "We're thrilled to announce our partnership with @GreenInitiative to reduce our carbon footprint. Together, we're making a difference! #Sustainability #GreenBusiness",
    author: "Jane Doe",
    authorImage: "",
    date: "3 hours ago",
    platform: "twitter" as const,
    status: "published" as const,
    engagement: {
      likes: 189,
      comments: 24,
      shares: 43,
    }
  },
  {
    id: 3,
    content: "Join our CEO for an exclusive webinar on digital transformation strategies for small businesses. Register now - link in bio! #DigitalTransformation #SmallBusiness #Webinar",
    author: "Events Team",
    authorImage: "",
    date: "Yesterday",
    platform: "linkedin" as const,
    status: "published" as const,
    engagement: {
      likes: 78,
      comments: 15,
      shares: 12,
    }
  }
];

const upcomingPosts = [
  {
    id: 4,
    content: "Get ready for our biggest sale of the year! Starting this Friday, enjoy up to 70% off on selected items. #MegaSale #ShopNow",
    author: "Sales Team",
    authorImage: "",
    date: "Tomorrow, 9:00 AM",
    platform: "facebook" as const,
    status: "scheduled" as const,
  },
  {
    id: 5,
    content: "Looking for career advice? Our new blog post covers everything from resume building to acing your interview. Check it out! #CareerAdvice #JobSearch",
    author: "Content Team",
    authorImage: "",
    date: "May 15, 2:30 PM",
    platform: "linkedin" as const,
    status: "scheduled" as const,
  }
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <Analytics />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <PostCard
                key={post.id}
                content={post.content}
                author={post.author}
                authorImage={post.authorImage}
                date={post.date}
                platform={post.platform}
                status={post.status}
                engagement={post.engagement}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Posts</h2>
          <div className="space-y-4">
            {upcomingPosts.map((post) => (
              <PostCard
                key={post.id}
                content={post.content}
                author={post.author}
                authorImage={post.authorImage}
                date={post.date}
                platform={post.platform}
                status={post.status}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
