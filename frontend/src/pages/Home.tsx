import { useNavigate } from "react-router-dom";
import { Plus, Book, Clock, BookOpen, Users, Bell, Menu } from "lucide-react";
import Mascot from "@/components/Mascot";
import FeatureCard from "@/components/FeatureCard";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Book,
      title: "Book Search",
      description: "Ask Libby to help you find books from our library collection.",
    },
    {
      icon: Clock,
      title: "Library Hours",
      description: "Check the library's operating hours and holiday schedules.",
    },
    {
      icon: BookOpen,
      title: "Borrowing Rules",
      description: "Learn about our borrowing policies and return guidelines.",
    },
    {
      icon: Users,
      title: "Discussion Rooms",
      description: "Ask about available discussion rooms, capacity, and schedules.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button className="p-2 rounded-xl hover:bg-muted transition-colors">
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <button className="glass-card px-4 py-2 text-sm font-medium text-foreground">
            Libby V.1
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
            ⚡ Libby V.2
          </button>
        </div>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors relative">
          <Bell className="w-6 h-6 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </header>

      {/* Welcome Section */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
          <Mascot size="sm" className="w-16 h-16" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hey, Scholar!</h1>
            <p className="text-muted-foreground">How are you today? Let's have a chat!</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => navigate("/chat")}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform animate-pulse-glow"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </section>


      {/* Features Section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Explore Features</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => navigate("/chat")}
              delay={index * 100 + 200}
            />
          ))}
        </div>
      </section>

      {/* FAB */}
      <button onClick={() => navigate("/chat")} className="fab">
        <Plus className="w-6 h-6" />
      </button>

      <BottomNav />
    </div>
  );
};

export default Home;
