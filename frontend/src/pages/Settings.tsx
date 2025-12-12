import { Bell, Moon, Globe, HelpCircle, Shield, Info, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const settingsSections = [
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", type: "toggle", defaultValue: true },
        { icon: Moon, label: "Dark Mode", type: "toggle", defaultValue: true },
        { icon: Globe, label: "Language", type: "link", value: "English" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", type: "link" },
        { icon: Shield, label: "Privacy Policy", type: "link" },
        { icon: Info, label: "About UBLC Library", type: "link" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="p-4">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </header>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <section key={section.title} className="px-4 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            {section.title}
          </h2>
          <div className="glass-card divide-y divide-border">
            {section.items.map((item, itemIndex) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${sectionIndex * 200 + itemIndex * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-muted">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                {item.type === "toggle" ? (
                  <Switch defaultChecked={item.defaultValue} />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {item.value && <span className="text-sm">{item.value}</span>}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* App Version */}
      <div className="text-center py-8 text-muted-foreground text-sm">
        <p>UBLC Library Assistant</p>
        <p>Version 1.0.0</p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
