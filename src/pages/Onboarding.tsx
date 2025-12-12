import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mascot from "@/components/Mascot";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const slides = [
    {
      title: "Hey! I'm Libby!",
      description: "Your friendly library assistant at University of Batangas Lipa Campus.",
    },
    {
      title: "Find Books Easily",
      description: "Search our extensive collection and discover new resources for your studies.",
    },
    {
      title: "Get Instant Help",
      description: "Ask me about library hours, borrowing rules, and available facilities.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < slides.length - 1) {
            setCurrentSlide((s) => s + 1);
            return 0;
          }
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  const handleSkip = () => {
    navigate("/home");
  };

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="p-4 flex items-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 rounded-full bg-muted overflow-hidden"
          >
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{
                width: index < currentSlide ? "100%" : index === currentSlide ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
        <button
          onClick={handleSkip}
          className="ml-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
        <div className="animate-fade-in-up">
          <Mascot size="lg" />
        </div>

        <div className="mt-8 text-center space-y-4 max-w-sm">
          <h1 className="text-3xl font-bold text-foreground animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {slides[currentSlide].title}
          </h1>
          <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
        <Button
          onClick={handleGetStarted}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:scale-[1.02] transition-transform"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
