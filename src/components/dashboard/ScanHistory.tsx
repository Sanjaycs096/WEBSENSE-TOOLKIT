'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { History, TrendingUp, Bot, RefreshCcw, Loader2 } from 'lucide-react';
import type { ScanHistoryEntry, ScoreHistoryPoint } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState, useCallback } from 'react';
import { summarizeScanHistory } from '@/ai/flows/summarize-scan-history';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type Props = {
  scanHistory: ScanHistoryEntry[];
};

type AiSummaryProps = {
  scanHistory: ScanHistoryEntry[];
}

export function AiSummary({ scanHistory }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>('Click the refresh button to generate an AI-powered summary of your security posture.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = useCallback(async () => {
    if (scanHistory.length === 0) {
      setSummary('No scans performed yet. Perform a scan to get an AI-powered summary.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const historyText = scanHistory
        .map(entry => `${entry.timestamp.toISOString()}: [${entry.type}] ${entry.summary} (Impact: ${entry.scoreImpact})`)
        .join('\n');
      const result = await summarizeScanHistory({ scanHistory: historyText });
      setSummary(result.summary);
    } catch (e: any) {
       if (e.message && e.message.includes('429')) {
         setError('You have exceeded the request limit for the AI service. Please try again later.');
       } else {
         setError('Could not generate AI summary. The service may be temporarily unavailable.');
       }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [scanHistory]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot /> AI Summary
          </div>
          <Button variant="ghost" size="icon" onClick={generateSummary} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
        </CardTitle>
        <CardDescription>An intelligent overview of your recent activity.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="space-y-2">
            <p className="h-4 bg-muted rounded w-5/6 animate-pulse"></p>
            <p className="h-4 bg-muted rounded w-full animate-pulse"></p>
            <p className="h-4 bg-muted rounded w-4/6 animate-pulse"></p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}

type ScoreHistoryProps = {
  scanHistory: ScanHistoryEntry[];
  initialScore: number;
};

export function ScoreHistory({ scanHistory, initialScore }: ScoreHistoryProps) {

  const scoreHistory = useMemo(() => {
    let currentScore = initialScore;
    const historyPoints: ScoreHistoryPoint[] = [
        { 
            date: (scanHistory.length > 0 ? scanHistory[0].timestamp.getTime() - 10000 : Date.now() - 3600 * 1000), 
            score: initialScore, 
            type: 'Initial', 
            summary: 'Starting Score' 
        }
    ];

    scanHistory.forEach(entry => {
      currentScore = Math.max(0, Math.min(100, currentScore + entry.scoreImpact));
      historyPoints.push({ date: entry.timestamp.getTime(), score: currentScore, type: entry.type, summary: entry.summary });
    });
    
    if (historyPoints.length === 1) {
        historyPoints.push({
            date: new Date().getTime(),
            score: currentScore,
            type: 'Current',
            summary: 'Current Score'
        });
    }

    return historyPoints;
  }, [scanHistory, initialScore]);


  const formatTick = (tick: number) => {
    const date = new Date(tick);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp /> Score History
        </CardTitle>
        <CardDescription>Your safety score trend over time.</CardDescription>
      </CardHeader>
      <CardContent>
        {scoreHistory.length > 1 ? (
          <div className="h-60 w-full">
            <ChartContainer config={{}} className="h-full w-full">
              <LineChart data={scoreHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => formatTick(tick)}
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" />
                <ChartTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => {
                         if (props.payload) {
                          const { type, summary } = props.payload;
                          return (
                              <>
                                  <div>Score: {value}</div>
                                  <div className="text-muted-foreground text-xs">{type}: {summary}</div>
                              </>
                          )
                         }
                         return `Score: ${value}`
                      }}
                      labelFormatter={(label) => new Date(label as number).toLocaleString()}
                    />
                  }
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={true} />
              </LineChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">
            Perform a scan to see your score history.
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export function RecentScans({ scanHistory }: Props) {
  return (
     <Card className="flex flex-col flex-grow h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History /> Recent Scans
        </CardTitle>
        <CardDescription>A log of your recent activity.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-60">
          {scanHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...scanHistory].reverse().map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.type}</TableCell>
                    <TableCell>{scan.summary}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDistanceToNow(scan.timestamp, { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No scans performed yet.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
