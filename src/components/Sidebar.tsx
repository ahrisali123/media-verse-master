
import { Link, useLocation } from "react-router-dom";
import { Calendar, Home, Image, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3",
          isActive && "bg-accent text-accent-foreground font-medium"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { to: "/", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/calendar", icon: <Calendar size={20} />, label: "Calendar" },
    { to: "/create-post", icon: <Image size={20} />, label: "Create Post" },
    { to: "/analytics", icon: <MessageSquare size={20} />, label: "Analytics" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" }
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-brand-600 flex items-center justify-center">
              <span className="text-white font-semibold">SM</span>
            </div>
            <h1 className="text-lg font-bold">SocialPro</h1>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-md bg-brand-600 flex items-center justify-center">
            <span className="text-white font-semibold">SM</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
      
      <div className="py-4 flex flex-col gap-2 px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={collapsed ? "" : item.label}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
    </aside>
  );
}
