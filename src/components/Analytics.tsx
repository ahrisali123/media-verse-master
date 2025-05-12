
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BestTimeToPost } from "./BestTimeToPost";

const engagementData = [
  { name: "Mon", value: 432 },
  { name: "Tue", value: 362 },
  { name: "Wed", value: 641 },
  { name: "Thu", value: 512 },
  { name: "Fri", value: 796 },
  { name: "Sat", value: 321 },
  { name: "Sun", value: 458 },
];

const platformData = [
  { name: "Instagram", value: 35 },
  { name: "Facebook", value: 25 },
  { name: "Twitter", value: 20 },
  { name: "LinkedIn", value: 15 },
  { name: "TikTok", value: 5 },
];

const followerGrowthData = [
  { name: "Jan", instagram: 2500, facebook: 3200, twitter: 1800, tiktok: 1200 },
  { name: "Feb", instagram: 2800, facebook: 3300, twitter: 1850, tiktok: 1500 },
  { name: "Mar", instagram: 3100, facebook: 3400, twitter: 1900, tiktok: 1900 },
  { name: "Apr", instagram: 3500, facebook: 3600, twitter: 2100, tiktok: 2400 },
  { name: "May", instagram: 3800, facebook: 3750, twitter: 2300, tiktok: 3100 },
  { name: "Jun", instagram: 4200, facebook: 3900, twitter: 2450, tiktok: 3800 },
];

const PLATFORM_COLORS = ["#E1306C", "#4267B2", "#1DA1F2", "#0077B5", "#000000"];

export function Analytics() {
  return (
    <div className="grid gap-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="stats-card col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Engagement</CardTitle>
                <CardDescription>Engagement across all platforms</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold">3,522</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-500">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="stats-card col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Scheduled Posts</CardTitle>
                <CardDescription>Posts scheduled for publication</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold">24</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-amber-500">8</span> due in next 48 hours
                </p>
              </CardContent>
            </Card>
            
            <Card className="stats-card col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Best Performing</CardTitle>
                <CardDescription>Platform with highest engagement</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold">Instagram</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-500">+24%</span> engagement rate
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-full md:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Engagement</CardTitle>
                <CardDescription>Total engagement across platforms for past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8445ff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Engagement by Platform</CardTitle>
                <CardDescription>Distribution across social media</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8445ff"
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="m-0">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Best Time to Post</CardTitle>
                <CardDescription>
                  Based on your audience engagement patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BestTimeToPost />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="followers" className="m-0">
          <div className="grid gap-4">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>Total followers across platforms over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={followerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="instagram" 
                      stackId="1" 
                      stroke="#E1306C" 
                      fill="#E1306C" 
                      fillOpacity={0.8}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="facebook" 
                      stackId="2" 
                      stroke="#4267B2" 
                      fill="#4267B2" 
                      fillOpacity={0.8}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="twitter" 
                      stackId="3" 
                      stroke="#1DA1F2" 
                      fill="#1DA1F2" 
                      fillOpacity={0.8}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tiktok" 
                      stackId="4" 
                      stroke="#000000" 
                      fill="#000000" 
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="stats-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Instagram Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4,200</div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500">+10.5%</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card className="stats-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Facebook Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3,900</div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500">+3.8%</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card className="stats-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">TikTok Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3,800</div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500">+22.6%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
