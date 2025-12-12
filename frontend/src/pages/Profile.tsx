import { User, BookOpen, Clock, Calendar, ChevronRight, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Mascot from "@/components/Mascot";

const Profile = () => {
  const stats = [
    { icon: BookOpen, label: "Books Borrowed", value: "12" },
    { icon: Clock, label: "Due Returns", value: "2" },
    { icon: Calendar, label: "Room Bookings", value: "5" },
  ];

  const menuItems = [
    { label: "Borrowed Books", description: "View your current loans" },
    { label: "Reservation History", description: "Past room bookings" },
    { label: "Reading History", description: "Books you've borrowed" },
    { label: "Favorites", description: "Saved books and resources" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header */}
      <div className="relative pt-8 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        
        <div className="relative text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted border-4 border-primary flex items-center justify-center animate-fade-in-up">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Juan Dela Cruz
          </h1>
          <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            BSIT - 3rd Year
          </p>
          <p className="text-sm text-primary animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Student ID: 2021-0001
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="px-4 -mt-8 mb-6">
        <div className="glass-card p-4 grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Items */}
      <section className="px-4 space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="w-full feature-card flex items-center justify-between opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="text-left">
              <h3 className="font-semibold text-foreground">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </section>

      {/* Mascot */}
      <div className="flex justify-center py-8">
        <Mascot size="sm" />
      </div>

      {/* Logout */}
      <section className="px-4 pb-8">
        <button className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive hover:border-destructive/50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </section>

      <BottomNav />
    </div>
  );
};

export default Profile;
