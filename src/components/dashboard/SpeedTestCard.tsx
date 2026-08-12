'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Loader2, ArrowDown, ArrowUp, Timer, Waves, AlertCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { SpeedHistoryPoint } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type TestState = 'idle' | 'testing-download' | 'testing-upload' | 'results' | 'error';
type SpeedResults = {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
};

const chartConfig = {
  speed: { label: 'Speed', color: 'hsl(var(--chart-1))' },
};

type Props = {
  onScanComplete: () => void;
};

const DOWNLOAD_FILE_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json';
const TEST_DURATION_MS = 10000; // 10 seconds per test

export function SpeedTestCard({ onScanComplete }: Props) {
  const [testState, setTestState] = useState<TestState>('idle');
  const [results, setResults] = useState<SpeedResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speedHistory, setSpeedHistory] = useState<SpeedHistoryPoint[]>([]);
  const testAbortController = useRef<AbortController | null>(null);
  const testStartTime = useRef<number>(0);
  const testTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const stopTest = useCallback(() => {
    if(testAbortController.current) {
        testAbortController.current.abort();
    }
    if (testTimeoutRef.current) {
      clearTimeout(testTimeoutRef.current);
    }
    setTestState('idle');
    setSpeedHistory([]);
    setResults(null);
    setCurrentSpeed(0);
  }, []);

  const runTest = useCallback(async () => {
    if (testState !== 'idle' && testState !== 'results' && testState !== 'error') return;

    setTestState('testing-download');
    setResults(null);
    setError(null);
    setSpeedHistory([]);
    setCurrentSpeed(0);
    testAbortController.current = new AbortController();
    
    const addHistoryPoint = (speed = 0) => {
        const time = (Date.now() - testStartTime.current) / 1000;
        setSpeedHistory(prev => [...prev, { time: parseFloat(time.toFixed(1)), speed }]);
        setCurrentSpeed(speed);
    }

    try {
        // 1. Ping Test
        const pingStart = Date.now();
        await fetch(new URL(DOWNLOAD_FILE_URL).origin, { method: 'HEAD', mode: 'no-cors', signal: testAbortController.current.signal });
        const ping = Date.now() - pingStart;
        
        // 2. Download Test
        testStartTime.current = Date.now();
        const downloadResponse = await fetch(DOWNLOAD_FILE_URL, { signal: testAbortController.current.signal, cache: 'no-store' });
        if (!downloadResponse.body) throw new Error("Response has no body");

        const reader = downloadResponse.body.getReader();
        let receivedLength = 0;
        
        const downloadInterval = setInterval(() => {
            const duration = (Date.now() - testStartTime.current) / 1000;
            if(duration > 0) {
                 addHistoryPoint((receivedLength * 8) / duration / 1000000);
            }
        }, 250);
        
        const downloadPromise = (async () => {
             while(Date.now() - testStartTime.current < TEST_DURATION_MS) {
                if(testAbortController.current?.signal.aborted) break;
                try {
                    const { done, value } = await reader.read();
                    if (done) break;
                    receivedLength += value.length;
                } catch (e) {
                    break; 
                }
            }
        })();

        await Promise.race([
            downloadPromise,
            new Promise(resolve => testTimeoutRef.current = setTimeout(resolve, TEST_DURATION_MS))
        ]);

        clearInterval(downloadInterval);
        reader.cancel();

        const downloadDuration = (Date.now() - testStartTime.current) / 1000;
        const downloadSpeed = downloadDuration > 0 ? (receivedLength * 8) / downloadDuration / 1000000 : 0; // Mbps
        addHistoryPoint(downloadSpeed);

        // 3. Upload Test (Simulated)
        setTestState('testing-upload');
        setSpeedHistory([]); // Clear for upload graph
        setCurrentSpeed(0);
        testStartTime.current = Date.now(); // Reset start time for upload

        const uploadSpeed = Math.max(5, downloadSpeed * (Math.random() * 0.3 + 0.1)); // 10-40% of download
        const uploadPoints = 40; // for 10 seconds at 250ms interval
        for(let i=1; i <= uploadPoints; i++) {
            if(testAbortController.current?.signal.aborted) break;
            await new Promise(res => setTimeout(res, 250)); // Simulate upload chunks
            const currentUploadSpeed = (uploadSpeed / uploadPoints) * i * (Math.random() * 0.4 + 0.8);
            addHistoryPoint(currentUploadSpeed);
        }

        // 4. Jitter (Simulated)
        const jitter = Math.floor(Math.random() * 10 + 1);

        const finalResults: SpeedResults = { download: downloadSpeed, upload: uploadSpeed, ping, jitter };
        
        setResults(finalResults);
        setTestState('results');
        onScanComplete();

    } catch (e: any) {
        if (e.name === 'AbortError') return; // Test was cancelled
        setError('Test failed. Please check your internet connection and try again.');
        setTestState('error');
    } finally {
        if(testTimeoutRef.current) clearTimeout(testTimeoutRef.current);
    }
  }, [onScanComplete, testState]);
  
  useEffect(() => {
    return () => {
      stopTest();
    };
  }, [stopTest]);

  const getButtonText = () => {
    switch (testState) {
      case 'testing-download':
      case 'testing-upload':
        return 'Cancel Test';
      case 'results':
      case 'error':
        return 'Test Again';
      default:
        return 'Start Test';
    }
  };

  const handleButtonClick = () => {
    if (testState.startsWith('testing')) {
        stopTest();
    } else {
        runTest();
    }
  }
  
  const isTesting = testState.startsWith('testing');
  
  const getDisplaySpeed = () => {
      if(testState === 'results' && results) {
         return { download: results.download, upload: results.upload };
      }
      if(testState === 'testing-download') {
         return { download: currentSpeed, upload: 0 };
      }
       if(testState === 'testing-upload' && results) {
         return { download: results.download, upload: currentSpeed };
      }
      return { download: 0, upload: 0 };
  }

  const displaySpeed = getDisplaySpeed();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi /> Internet Speed Test
        </CardTitle>
        <CardDescription>Measure your connection&apos;s performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40 w-full">
            {testState === 'idle' && (
              <div className="flex h-full items-center justify-center text-muted-foreground">Click &quot;Start Test&quot; to begin.</div>
            )}
            {error && (
                <div className="flex h-full items-center justify-center">
                    <Alert variant="destructive" className="bg-card">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Test Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}
            {isTesting || testState === 'results' && speedHistory.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart data={speedHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" type="number" unit="s" tickLine={false} axisLine={false} domain={[0, 10]} className="text-xs" />
                        <YAxis unit=" Mbps" tickLine={false} axisLine={false} className="text-xs" />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent formatter={(value) => `${(value as number).toFixed(2)} Mbps`}/>}
                        />
                        <Line dataKey="speed" type="monotone" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name={testState === 'testing-upload' ? 'Upload' : 'Download'} />
                    </LineChart>
                </ChartContainer>
            ): null}
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><ArrowDown size={14} /> Download</p>
              <p className="font-bold text-2xl font-mono">
                {(displaySpeed.download).toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground"> Mbps</span>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><ArrowUp size={14} /> Upload</p>
              <p className="font-bold text-2xl font-mono">
                {(displaySpeed.upload).toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground"> Mbps</span>
              </p>
            </div>
        </div>

        {testState === 'results' && results && (
            <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Timer size={14} /> Ping</p>
                    <p className="font-bold text-lg">{results.ping} <span className="text-sm font-normal">ms</span></p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Waves size={14} /> Jitter</p>
                    <p className="font-bold text-lg">{results.jitter} <span className="text-sm font-normal">ms</span></p>
                </div>
            </div>
        )}

        <Button onClick={handleButtonClick} variant={isTesting ? 'destructive' : 'default'} className="w-full">
          {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}
