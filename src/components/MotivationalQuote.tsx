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
    <div className="relative bg-gradient-secondary rounded-3xl p-10 shadow-elegant hover:shadow-glow-secondary transition-all duration-500 overflow-hidden group border border-white/20">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 animate-float blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 animate-float blur-2xl" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-secondary-foreground animate-pulse" />
            </div>
            <span className="text-secondary-foreground font-bold text-2xl tracking-wide drop-shadow">Daily Motivation</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={changeQuote}
            className="text-secondary-foreground hover:bg-white/20 hover:rotate-180 transition-all duration-500 w-12 h-12 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-6 h-6" />
          </Button>
        </div>
        
        <p className={`text-3xl font-black text-secondary-foreground transition-all duration-300 leading-relaxed drop-shadow-lg ${
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}>
          "{quote}"
        </p>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl-xl" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br-xl" />
    </div>
  );
};
