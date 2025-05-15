
import { Sidebar } from "@/components/Sidebar";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SocialConnectPanel } from "@/components/SocialConnectPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { SettingsContent } from "@/components/SettingsContent";

const Settings = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProfileHeader />
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="connections">Social Connections</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <SettingsContent />
            </TabsContent>
            
            <TabsContent value="connections" className="space-y-4">
              <SocialConnectPanel />
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Preferences</h2>
                <p>Manage your app preferences and notifications settings.</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Billing</h2>
                <p>Manage your subscription and billing information.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
