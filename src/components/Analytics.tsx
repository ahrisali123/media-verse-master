
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
  Legend
} from "recharts";

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
  { name: "Pinterest", value: 5 },
];

const PLATFORM_COLORS = ["#E1306C", "#4267B2", "#1DA1F2", "#0077B5", "#E60023"];

export function Analytics() {
  return (
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
  );
}
