import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsContent() {
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [tiktokIntegration, setTiktokIntegration] = useState(false);
  const [reelsSupport, setReelsSupport] = useState(true);

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid grid-cols-5 w-full max-w-md mb-6"> {/* Changed from 4 to 5 columns */}
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="accounts">Accounts</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger> {/* Added new tab */}
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">AI Content Suggestions</h4>
                <p className="text-sm text-muted-foreground">
                  Enable AI-powered content suggestions
                </p>
              </div>
              <Switch 
                checked={aiSuggestions} 
                onCheckedChange={setAiSuggestions} 
                aria-label="Auto schedule toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto Schedule Posts</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically schedule posts at optimal times
                </p>
              </div>
              <Switch 
                checked={autoSchedule} 
                onCheckedChange={setAutoSchedule} 
                aria-label="Auto schedule toggle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select className="w-full p-2 border rounded">
                <option>UTC (Universal Time Coordinated)</option>
                <option>ET (Eastern Time)</option>
                <option>CT (Central Time)</option>
                <option>MT (Mountain Time)</option>
                <option>PT (Pacific Time)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select className="w-full p-2 border rounded">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Tell us about yourself" 
                className="min-h-[100px]"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="accounts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                  In
                </div>
                <div>
                  <h4 className="font-medium">Instagram</h4>
                  <p className="text-sm text-muted-foreground">@youraccount</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Disconnect</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  Fb
                </div>
                <div>
                  <h4 className="font-medium">Facebook</h4>
                  <p className="text-sm text-muted-foreground">Your Page</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Disconnect</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                  Tw
                </div>
                <div>
                  <h4 className="font-medium">Twitter</h4>
                  <p className="text-sm text-muted-foreground">@yourhandle</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Disconnect</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
                  Tk
                </div>
                <div>
                  <h4 className="font-medium">TikTok</h4>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="default" size="sm">Connect</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your desktop
                </p>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled} 
                aria-label="Auto schedule toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch 
                defaultChecked 
                aria-label="Email notifications toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Post Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified about post performance
                </p>
              </div>
              <Switch 
                defaultChecked 
                aria-label="Post performance toggle"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Content Features</CardTitle>
            <CardDescription>
              Control content creation capabilities and platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">TikTok Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Enable TikTok video posting and analytics
                </p>
              </div>
              <Switch 
                checked={tiktokIntegration} 
                onCheckedChange={setTiktokIntegration} 
                aria-label="TikTok integration toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reels & Video Support</h4>
                <p className="text-sm text-muted-foreground">
                  Enable posting videos and reels to Instagram and TikTok
                </p>
              </div>
              <Switch 
                checked={reelsSupport} 
                onCheckedChange={setReelsSupport} 
                aria-label="Reels support toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">AI Content Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Generate captions, hashtags and content suggestions using AI
                </p>
              </div>
              <Switch 
                checked={aiSuggestions}
                onCheckedChange={setAiSuggestions}
                aria-label="AI content generation toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Best Time to Post Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically analyze past engagement for optimal posting times
                </p>
              </div>
              <Switch 
                defaultChecked
                aria-label="Best time analysis toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Follower Growth Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Track follower growth across all platforms
                </p>
              </div>
              <Switch 
                defaultChecked
                aria-label="Follower tracking toggle"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="privacy" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </div>
            <div className="pt-4 mt-4 border-t">
              <h4 className="font-medium mb-2">Two Factor Authentication</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
