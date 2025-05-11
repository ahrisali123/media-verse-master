
import { Sidebar } from "@/components/Sidebar";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ContentCalendar } from "@/components/Calendar";

const CalendarPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProfileHeader />
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Content Calendar</h1>
          <ContentCalendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
