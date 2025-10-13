import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: "primary" | "accent" | "success";
  delay?: number;
}

export const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }: StatCardProps) => {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    accent: "bg-gradient-accent",
    success: "bg-gradient-success",
  };

  const shadowClasses = {
    primary: "shadow-glow",
    accent: "shadow-card",
    success: "shadow-glow-success",
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`relative overflow-hidden ${gradientClasses[gradient]} rounded-3xl p-8 shadow-elegant hover:${shadowClasses[gradient]} transition-all duration-500 hover:scale-105 cursor-pointer group border border-white/20`}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Icon className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <Icon className="w-10 h-10 text-white/40 group-hover:text-white/60 group-hover:scale-125 transition-all duration-300" />
          </div>
          <div className="text-5xl font-black text-white mb-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-300 origin-left">{value}</div>
          <div className="text-white/90 text-base font-bold uppercase tracking-wider drop-shadow">{title}</div>
        </div>

        {/* Decorative corner */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </div>
  );
};
