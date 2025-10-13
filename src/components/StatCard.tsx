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

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`${gradientClasses[gradient]} rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer group`}>
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform" />
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="text-4xl font-bold text-white mb-2">{value}</div>
        <div className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</div>
      </div>
    </div>
  );
};
