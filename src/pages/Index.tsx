
import { Sidebar } from "@/components/Sidebar";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const { isLoading } = useAuth();
  
  useEffect(() => {
    console.log("Index page loaded, auth loading state:", isLoading);
  }, [isLoading]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProfileHeader />
        <div className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default Index;
