import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { DayContentProps } from "react-day-picker";

interface Session {
  start: string;
  end: string;
  duration_hours: number;
}

interface UsageData {
  [date: string]: Session[];
}

interface UsageCalendarProps {
  usageData: UsageData;
}

export const UsageCalendar = ({ usageData }: UsageCalendarProps) => {
  const [month, setMonth] = useState<Date>(new Date());

  const getHoursForDate = (date: Date): number => {
    const dateStr = date.toISOString().split("T")[0];
    return usageData[dateStr]?.reduce((sum, s) => sum + s.duration_hours, 0) || 0;
  };

  const getDayColor = (hours: number): string => {
    if (hours === 0) return "";
    if (hours < 1) return "bg-red-500/60 hover:bg-red-500/80";
    if (hours < 2) return "bg-orange-500/60 hover:bg-orange-500/80";
    if (hours < 3) return "bg-yellow-500/60 hover:bg-yellow-500/80";
    if (hours < 4) return "bg-lime-500/60 hover:bg-lime-500/80";
    return "bg-green-500/60 hover:bg-green-500/80";
  };

  const CustomDay = (props: DayContentProps) => {
    const hours = getHoursForDate(props.date);
    const colorClass = getDayColor(hours);
    
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center rounded-md ${colorClass} transition-colors`}
        title={hours > 0 ? `${hours.toFixed(2)} hours` : "No data"}
      >
        <span className={hours > 0 ? "font-bold text-white" : ""}>
          {props.date.getDate()}
        </span>
      </div>
    );
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Usage Calendar
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Track your productivity across months
        </p>
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/60" />
            <span>0-1h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/60" />
            <span>1-2h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/60" />
            <span>2-3h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-lime-500/60" />
            <span>3-4h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/60" />
            <span>4+h</span>
          </div>
        </div>
      </div>
      <Calendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        className="rounded-md border"
        components={{
          DayContent: CustomDay,
        }}
      />
    </Card>
  );
};
