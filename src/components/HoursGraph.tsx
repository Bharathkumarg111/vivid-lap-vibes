import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Session {
  start: string;
  end: string;
  duration_hours: number;
}

interface UsageData {
  [date: string]: Session[];
}

interface HoursGraphProps {
  usageData: UsageData;
}

export const HoursGraph = ({ usageData }: HoursGraphProps) => {
  const chartData = Object.entries(usageData)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .slice(-30) // Last 30 days
    .map(([date, sessions]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: sessions.reduce((sum, s) => sum + s.duration_hours, 0),
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.date}</p>
          <p className="text-primary font-bold">{payload[0].value.toFixed(2)} hours</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Daily Hours Graph
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Your productivity over the last 30 days
        </p>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--foreground))' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="hours" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data to display yet. Start tracking your sessions!
        </div>
      )}
    </Card>
  );
};
