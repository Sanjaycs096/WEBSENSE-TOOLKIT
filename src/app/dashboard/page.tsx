'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/dashboard/Header';
import { IpAnalysisCard } from '@/components/dashboard/IpAnalysisCard';
import { SpeedTestCard } from '@/components/dashboard/SpeedTestCard';
import { UrlAnalyzerCard } from '@/components/dashboard/UrlAnalyzerCard';
import { PasswordToolkitCard } from '@/components/dashboard/PasswordToolkitCard';
import { ImageAuthenticityCard } from '@/components/dashboard/ImageAuthenticityCard';
import { SafetyScoreCard } from '@/components/dashboard/SafetyScoreCard';
import { AiSummary, ScoreHistory, RecentScans } from '@/components/dashboard/ScanHistory';
import type { IpInfo, ScanHistoryEntry, ScoreWeights } from '@/lib/types';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const INITIAL_SCORE = 10;

const SCORE_WEIGHTS: ScoreWeights = {
  ip: 10,
  url: 15,
  speed: 20,
  password: {
    strength: 10,
    generator: 5,
    leak: 10,
  },
  image: 30,
};

function Dashboard() {
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);
  const [safetyScore, setSafetyScore] = useState(INITIAL_SCORE);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scansCompleted, setScansCompleted] = useState<Set<string>>(new Set(['ip']));

  const sections = {
    url: useRef<HTMLDivElement>(null),
    speed: useRef<HTMLDivElement>(null),
    ip: useRef<HTMLDivElement>(null),
    password: useRef<HTMLDivElement>(null),
    image: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addScanHistory = useCallback((entry: Omit<ScanHistoryEntry, 'id' | 'timestamp'>) => {
    setScanHistory(prev => {
      const newEntry = {
        ...entry,
        id: `scan-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };
      return [...prev, newEntry];
    });
  }, []);
  
  const handleScanCompletion = useCallback((scanType: string, scoreToAdd: number, summary: string) => {
    if (!scansCompleted.has(scanType)) {
      setSafetyScore(prev => Math.min(100, prev + scoreToAdd));
      addScanHistory({
        type: scanType as any,
        summary: `Completed (+${scoreToAdd})`,
        scoreImpact: scoreToAdd,
      });
      setScansCompleted(prev => new Set(prev).add(scanType));
    }
  }, [scansCompleted, addScanHistory]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header sections={sections} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Row 1 */}
          <div className="md:col-span-7 lg:col-span-8">
            <SafetyScoreCard score={safetyScore} ipInfo={ipInfo} />
          </div>
          <div className="md:col-span-5 lg:col-span-4">
             <ScoreHistory scanHistory={scanHistory} initialScore={INITIAL_SCORE} />
          </div>

          {/* Row 2 */}
          <div className="md:col-span-4" ref={sections.url}><UrlAnalyzerCard onScanComplete={() => handleScanCompletion('url', SCORE_WEIGHTS.url, 'URL Scan')} /></div>
          <div className="md:col-span-4" ref={sections.speed}><SpeedTestCard onScanComplete={() => handleScanCompletion('speed', SCORE_WEIGHTS.speed, 'Speed Test')} /></div>
          <div className="md:col-span-4" ref={sections.ip}><IpAnalysisCard setIpInfo={setIpInfo} /></div>

          {/* Row 3 */}
          <div className="md:col-span-6" ref={sections.password}><PasswordToolkitCard onScanComplete={handleScanCompletion} weights={SCORE_WEIGHTS.password} /></div>
          <div className="md:col-span-6" ref={sections.image}><ImageAuthenticityCard onScanComplete={() => handleScanCompletion('image', SCORE_WEIGHTS.image, 'Image Analysis')} /></div>
          
           {/* Row 4 */}
          <div className="md:col-span-6">
            <AiSummary scanHistory={scanHistory} />
          </div>
           <div className="md:col-span-6">
            <RecentScans scanHistory={scanHistory} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between gap-4 border-b bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-40 h-6" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-9" />
            <Skeleton className="w-10 h-10" />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
                <Skeleton className="h-48 w-full" />
            </div>
             <div className="md:col-span-4">
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="md:col-span-4"><Skeleton className="h-96" /></div>
            <div className="md:col-span-4"><Skeleton className="h-96" /></div>
            <div className="md:col-span-4"><Skeleton className="h-96" /></div>
            <div className="md:col-span-6"><Skeleton className="h-96" /></div>
            <div className="md:col-span-6"><Skeleton className="h-96" /></div>
          </div>
        </main>
      </div>
    );
  }

  return <Dashboard />;
}
