import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, onClick, delay = 0 }: FeatureCardProps) => {
  return (
    <div
      className="feature-card opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
      <button className="mt-4 w-full py-2 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
        Start Chat
      </button>
    </div>
  );
};

export default FeatureCard;
