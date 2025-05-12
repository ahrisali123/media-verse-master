
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type PlatformData = {
  [key: string]: {
    bestDay: string;
    bestTimes: string[];
    worstDay: string;
  }
};

const platformTimeData: PlatformData = {
  instagram: {
    bestDay: "Wednesday",
    bestTimes: ["11:00 AM", "1:00 PM", "3:00 PM"],
    worstDay: "Sunday"
  },
  facebook: {
    bestDay: "Thursday",
    bestTimes: ["1:00 PM", "3:00 PM", "9:00 AM"],
    worstDay: "Saturday"
  },
  twitter: {
    bestDay: "Wednesday",
    bestTimes: ["9:00 AM", "12:00 PM", "5:00 PM"],
    worstDay: "Saturday"
  },
  linkedin: {
    bestDay: "Tuesday",
    bestTimes: ["10:00 AM", "2:00 PM", "4:00 PM"],
    worstDay: "Friday"
  },
  tiktok: {
    bestDay: "Tuesday",
    bestTimes: ["9:00 AM", "12:00 PM", "7:00 PM"],
    worstDay: "Sunday"
  }
};

export function BestTimeToPost() {
  const [platform, setPlatform] = useState("instagram");
  const data = platformTimeData[platform];
  
  // Calculate the time block colors
  const timeBlocks = DAYS.map(day => {
    const hours = Array.from({ length: 24 }, (_, hour) => {
      let intensity = Math.random() * 0.7; // Base random intensity
      
      // Boost intensity for best day and best times
      if (day === data.bestDay) {
        intensity += 0.2;
        
        // Convert best times to hours
        const bestHours = data.bestTimes.map(time => {
          const [hourStr, period] = time.split(':')[0].trim().split(' ');
          let hour = parseInt(hourStr);
          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;
          return hour;
        });
        
        if (bestHours.includes(hour)) {
          intensity += 0.3;
        }
      }
      
      // Reduce intensity for worst day
      if (day === data.worstDay) {
        intensity -= 0.2;
      }
      
      // Ensure intensity is between 0 and 1
      intensity = Math.max(0, Math.min(1, intensity));
      
      return {
        hour,
        intensity
      };
    });
    
    return {
      day,
      hours
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Optimal Posting Times</h3>
          <p className="text-sm text-muted-foreground">
            Based on your audience engagement patterns
          </p>
        </div>
        <div className="w-full sm:w-[180px]">
          <Label htmlFor="platform-select" className="mb-1 block">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
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
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px]">
          <div className="flex">
            <div className="w-[80px] flex-shrink-0"></div>
            <div className="flex-1 grid grid-cols-24">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="text-center text-xs">
                  {i % 3 === 0 && (
                    <span>
                      {i === 0 ? '12am' : i < 12 ? `${i}am` : i === 12 ? '12pm' : `${i-12}pm`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {timeBlocks.map((dayData) => (
            <div key={dayData.day} className="flex mt-1 items-center">
              <div className="w-[80px] text-sm font-medium pr-2">{dayData.day}</div>
              <div className="flex-1 grid grid-cols-24 gap-px">
                {dayData.hours.map((hourData) => (
                  <div
                    key={hourData.hour}
                    className="h-8 rounded-sm"
                    style={{
                      backgroundColor: `rgba(132, 69, 255, ${hourData.intensity})`,
                      opacity: hourData.intensity === 0 ? 0.1 : 1
                    }}
                    title={`${dayData.day}, ${hourData.hour}:00 - Engagement Level: ${Math.round(hourData.intensity * 100)}%`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex flex-col">
          <div className="text-sm font-medium text-muted-foreground mb-1">Best Day to Post</div>
          <div className="text-xl font-semibold">{data.bestDay}</div>
        </Card>
        <Card className="p-4 flex flex-col">
          <div className="text-sm font-medium text-muted-foreground mb-1">Best Times</div>
          <div className="text-xl font-semibold">{data.bestTimes.join(", ")}</div>
        </Card>
        <Card className="p-4 flex flex-col">
          <div className="text-sm font-medium text-muted-foreground mb-1">Recommended Next Post</div>
          <div className="text-xl font-semibold">{data.bestDay}, {data.bestTimes[0]}</div>
        </Card>
      </div>
    </div>
  );
}
