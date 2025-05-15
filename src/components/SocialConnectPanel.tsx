
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle,
  CheckCircle, 
  X
} from "lucide-react";
import { useSocialMedia } from "@/hooks/useSocialMedia";

export function SocialConnectPanel() {
  const { 
    isLoading, 
    accounts, 
    loadUserAccounts, 
    connectAccount, 
    disconnectAccount 
  } = useSocialMedia();
  
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");

  useEffect(() => {
    loadUserAccounts();
  }, []);

  const handleConnect = async () => {
    if (!accessToken || !username) {
      return;
    }
    
    await connectAccount(selectedPlatform, accessToken, username);
    setAccessToken("");
    setUsername("");
  };

  const handleDisconnect = async (accountId: string, platform: string) => {
    await disconnectAccount(accountId, platform);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      case "twitter":
        return <MessageCircle className="h-5 w-5 text-blue-400" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  const isConnected = (platform: string) => {
    return accounts.some(account => account.platform === platform);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Social Media Accounts</CardTitle>
        <CardDescription>
          Link your social media accounts to manage them in one place
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant={selectedPlatform === "facebook" ? "default" : "outline"}
            className="flex items-center justify-center gap-2 h-16" 
            onClick={() => setSelectedPlatform("facebook")}
          >
            <Facebook className="h-5 w-5" />
            Facebook
            {isConnected("facebook") && (
              <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
            )}
          </Button>
          <Button 
            variant={selectedPlatform === "instagram" ? "default" : "outline"}
            className="flex items-center justify-center gap-2 h-16" 
            onClick={() => setSelectedPlatform("instagram")}
          >
            <Instagram className="h-5 w-5" />
            Instagram
            {isConnected("instagram") && (
              <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
            )}
          </Button>
          <Button 
            variant={selectedPlatform === "linkedin" ? "default" : "outline"}
            className="flex items-center justify-center gap-2 h-16" 
            onClick={() => setSelectedPlatform("linkedin")}
          >
            <Linkedin className="h-5 w-5" />
            LinkedIn
            {isConnected("linkedin") && (
              <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
            )}
          </Button>
          <Button 
            variant={selectedPlatform === "tiktok" ? "default" : "outline"}
            className="flex items-center justify-center gap-2 h-16" 
            onClick={() => setSelectedPlatform("tiktok")}
          >
            <MessageCircle className="h-5 w-5" />
            TikTok
            {isConnected("tiktok") && (
              <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder={`Enter your ${selectedPlatform} username`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input 
              id="accessToken" 
              value={accessToken} 
              onChange={(e) => setAccessToken(e.target.value)} 
              type="password"
              placeholder={`Enter your ${selectedPlatform} access token`} 
            />
          </div>
        </div>

        <div>
          <Button 
            className="w-full" 
            onClick={handleConnect}
            disabled={isLoading || !accessToken || !username}
          >
            {isLoading ? "Connecting..." : `Connect ${selectedPlatform}`}
          </Button>
        </div>

        {accounts.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Connected Accounts</h3>
            <div className="space-y-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between border p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(account.platform)}
                    <span className="font-medium">{account.username}</span>
                    <span className="text-xs text-gray-500">({account.platform})</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDisconnect(account.id, account.platform)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          Connect your accounts to start managing your social media content in one place.
        </p>
      </CardFooter>
    </Card>
  );
}
