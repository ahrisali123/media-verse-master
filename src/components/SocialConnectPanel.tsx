
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
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle,
  CheckCircle, 
  X
} from "lucide-react";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SocialConnectPanel() {
  const { 
    isLoading, 
    accounts, 
    loadUserAccounts, 
    disconnectAccount 
  } = useSocialMedia();
  
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUserAccounts();
  }, []);

  // Handle OAuth authentication redirect response
  useEffect(() => {
    // Parse the URL on component mount to check for OAuth redirect
    const handleOAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        // Extract token params
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const state = params.get('state');
        
        if (accessToken && state) {
          try {
            // Decode the state to get platform and other info
            const { platform, username } = JSON.parse(atob(state));
            
            // Use our existing connect function from useSocialMedia hook
            const result = await useSocialMedia().connectAccount(
              platform,
              accessToken,
              username || `${platform}_user` // Fallback username if none provided
            );
            
            if (result.success) {
              toast({
                title: "Account connected successfully",
                description: `Your ${platform} account has been connected.`,
              });
              loadUserAccounts(); // Refresh accounts list
            } else {
              toast({
                title: "Connection failed",
                description: "Failed to connect account. Please try again.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error("Error handling OAuth redirect:", error);
            toast({
              title: "Connection failed",
              description: "Unable to process authentication response.",
              variant: "destructive",
            });
          }
          
          // Clean the URL to remove hash fragment
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    
    handleOAuthRedirect();
  }, []);

  const initiateOAuth = async (platform: string) => {
    setOauthLoading(platform);
    try {
      let provider: string;
      let redirectUrl = `${window.location.origin}/settings`; // Redirect back to settings page
      
      // Map our platform names to Supabase provider names
      switch (platform) {
        case "facebook":
          provider = "facebook";
          break;
        case "instagram":
          // For Instagram we use Facebook's OAuth
          provider = "facebook";
          break;
        case "linkedin":
          provider = "linkedin_oidc"; // Using OIDC for LinkedIn
          break;
        case "tiktok":
          // TikTok OAuth implementation via custom endpoint
          // Note: For actual implementation, you'll need to set up a TikTok developer account
          window.location.href = `https://www.tiktok.com/auth/authorize/?client_key=YOUR_CLIENT_KEY&response_type=code&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user.info.basic&state=${btoa(JSON.stringify({ platform: "tiktok" }))}`;
          return;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      // Encode platform info in state parameter
      const state = btoa(JSON.stringify({ platform }));
      
      // Use Supabase OAuth for supported platforms
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: redirectUrl,
          scopes: getPlatformScopes(platform),
          queryParams: {
            state // Pass platform info via state parameter
          }
        }
      });

      if (error) {
        throw error;
      }

      // Supabase will handle the redirect automatically
    } catch (error: any) {
      console.error(`Error initiating ${platform} OAuth:`, error);
      toast({
        title: "Connection failed",
        description: error.message || `Failed to connect to ${platform}`,
        variant: "destructive",
      });
      setOauthLoading(null);
    }
  };

  // Get required OAuth scopes for each platform
  const getPlatformScopes = (platform: string): string => {
    switch (platform) {
      case "facebook":
        return "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts";
      case "instagram":
        return "instagram_basic,instagram_content_publish,instagram_manage_comments";
      case "linkedin":
        return "r_liteprofile,r_emailaddress,w_member_social";
      default:
        return "";
    }
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
      case "tiktok":
        return <MessageCircle className="h-5 w-5" />;
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

        <div>
          <Button 
            className="w-full" 
            onClick={() => initiateOAuth(selectedPlatform)}
            disabled={isLoading || oauthLoading === selectedPlatform || isConnected(selectedPlatform)}
          >
            {oauthLoading === selectedPlatform 
              ? "Connecting..." 
              : isConnected(selectedPlatform)
                ? `Connected to ${selectedPlatform}`
                : `Connect with ${selectedPlatform}`}
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
                    onClick={() => disconnectAccount(account.id, account.platform)}
                    disabled={isLoading}
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
