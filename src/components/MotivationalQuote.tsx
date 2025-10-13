import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

const quotes = [
  "Keep pushing, success is near!",
  "Every hour counts, make it meaningful!",
  "Small steps each day lead to big results.",
  "Stay consistent, stay motivated.",
  "Your hard work will pay off soon!",
  "Focus on progress, not perfection.",
  "Turn your dreams into plans, and plans into reality.",
  "The secret to getting ahead is getting started.",
];

export const MotivationalQuote = () => {
  const [quote, setQuote] = useState(quotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const changeQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(changeQuote, 10000); // Auto-change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-accent rounded-2xl p-8 shadow-card relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-float" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-foreground" />
            <span className="text-accent-foreground font-semibold text-lg">Daily Motivation</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={changeQuote}
            className="text-accent-foreground hover:bg-white/20 hover:rotate-180 transition-all duration-500"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
        
        <p className={`text-2xl font-bold text-accent-foreground transition-all duration-300 ${
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}>
          "{quote}"
        </p>
      </div>
    </div>
  );
};
