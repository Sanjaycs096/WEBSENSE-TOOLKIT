'use client';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link, Loader2, CheckCircle } from 'lucide-react';
import { analyzeUrl, type UrlAnalysisResult } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Server } from 'lucide-react';
import { Shield } from 'lucide-react';

type Props = {
  onScanComplete: () => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Analyze
    </Button>
  );
}

export function UrlAnalyzerCard({ onScanComplete }: Props) {
  const initialState = { result: null, error: null };
  const [state, formAction] = useActionState(analyzeUrl, initialState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (state.result && isMounted) {
      onScanComplete();
    }
  }, [state.result, onScanComplete, isMounted]);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link /> URL &amp; Website Analyzer
          </CardTitle>
          <CardDescription>Check any URL for safety and performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Input name="url" placeholder="https://example.com" required />
            <SubmitButton />
          </div>
          {state.error && (
            <p className="text-sm text-destructive mt-2">{state.error}</p>
          )}
        </CardContent>
      </form>
      {isMounted && state.result && <Results data={state.result} />}
    </Card>
  );
}

function Results({ data }: { data: UrlAnalysisResult }) {
  return (
    <CardContent className="space-y-4">
      <div className="p-4 border rounded-lg bg-muted/20">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold font-headline">Overall Performance</h4>
            <span className={`font-bold text-xl ${data.performanceScore > 70 ? 'text-secondary' : data.performanceScore > 40 ? 'text-yellow-500' : 'text-destructive'}`}>{data.performanceScore}/100</span>
        </div>
        <Progress value={data.performanceScore} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert variant={data.safety.isSafe ? 'default' : 'destructive'} className="bg-card">
          <Shield className="h-4 w-4" />
          <AlertTitle>URL Safety</AlertTitle>
          <AlertDescription>{data.safety.message}</AlertDescription>
        </Alert>

        <Alert variant={data.uptime.isUp ? 'default' : 'destructive'} className="bg-card">
          <Server className="h-4 w-4" />
          <AlertTitle>Uptime</AlertTitle>
          <AlertDescription>{data.uptime.message}</AlertDescription>
        </Alert>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold font-headline">Security Details</h4>
        <div className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><CheckCircle className={data.ssl.isValid ? "text-secondary" : "text-muted-foreground"} size={16} /> SSL Certificate</div>
                <Badge variant={data.ssl.isValid ? "secondary" : "destructive"}>{data.ssl.hasSSL ? (data.ssl.isValid ? 'Valid' : 'Invalid') : 'None'}</Badge>
            </div>
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><CheckCircle className={data.headers.hasCSP ? "text-secondary" : "text-muted-foreground"} size={16} /> Content-Security-Policy</div>
                <Badge variant={data.headers.hasCSP ? "secondary" : "outline"}>{data.headers.hasCSP ? 'Present' : 'Missing'}</Badge>
            </div>
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><CheckCircle className={data.headers.hasXFrame ? "text-secondary" : "text-muted-foreground"} size={16} /> X-Frame-Options</div>
                <Badge variant={data.headers.hasXFrame ? "secondary" : "outline"}>{data.headers.hasXFrame ? 'Present' : 'Missing'}</Badge>
            </div>
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><CheckCircle className={data.headers.hasHSTS ? "text-secondary" : "text-muted-foreground"} size={16} /> Strict-Transport-Security</div>
                <Badge variant={data.headers.hasHSTS ? "secondary" : "outline"}>{data.headers.hasHSTS ? 'Present' : 'Missing'}</Badge>
            </div>
        </div>
      </div>
    </CardContent>
  );
}
