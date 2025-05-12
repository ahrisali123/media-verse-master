
import { Sidebar } from "@/components/Sidebar";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SettingsContent } from "@/components/SettingsContent";

const Settings = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProfileHeader />
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <SettingsContent />
        </div>
      </div>
    </div>
  );
};

export default Settings;
