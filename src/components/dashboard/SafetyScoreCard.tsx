'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Label, Pie, PieChart, Cell } from 'recharts';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { IpInfo } from '@/lib/types';

type Props = {
  score: number;
  ipInfo: IpInfo | null;
};

export function SafetyScoreCard({ score, ipInfo }: Props) {
  const chartData = [{ name: 'score', value: score, fill: 'hsl(var(--chart-1))' }];
  const remaining = 100 - score;

  const getStatus = () => {
    if (score >= 80) return { text: 'Excellent', icon: <ShieldCheck className="w-5 h-5 text-secondary" /> };
    if (score >= 60) return { text: 'Good', icon: <ShieldCheck className="w-5 h-5 text-yellow-500" /> };
    if (score >= 40) return { text: 'Fair', icon: <ShieldAlert className="w-5 h-5 text-orange-500" /> };
    return { text: 'Poor', icon: <ShieldAlert className="w-5 h-5 text-destructive" /> };
  };

  const status = getStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield /> Unified Digital Safety Score
        </CardTitle>
        <CardDescription>
          Your current security posture at a glance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-48 w-full">
            <ChartContainer config={{}} className="mx-auto aspect-square h-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  cy="50%"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold font-headline"
                            >
                              {score.toFixed(0)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              / 100
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <Pie
                  data={[{ value: remaining }]}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  fill="hsl(var(--muted))"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {status.icon}
              <h3 className="text-2xl font-bold font-headline">
                Your safety score is {status.text}.
              </h3>
            </div>
            <p className="text-muted-foreground">
              {ipInfo?.security?.is_vpn || ipInfo?.security?.is_proxy
                ? "Your connection appears to be anonymized via a VPN or Proxy, which is great for privacy."
                : "Your public IP address appears to be directly exposed. For enhanced privacy, consider using a VPN."}
            </p>
            <p className="text-muted-foreground">
              Use the tools below to perform scans and improve your score.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
