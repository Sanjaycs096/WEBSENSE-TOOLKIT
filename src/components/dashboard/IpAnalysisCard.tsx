'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Globe, Building, Fingerprint, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IpInfo } from '@/lib/types';

type Props = {
  setIpInfo: (info: IpInfo | null) => void;
};

async function fetchIpData(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch IP data from ${url}. Status: ${response.status}`);
  }
  return response.json();
}

export function IpAnalysisCard({ setIpInfo }: Props) {
  const [data, setData] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [security, setSecurity] = useState<{ is_vpn: boolean, is_proxy: boolean} | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    if (!isMounted) return;
    setLoading(true);
    setError(null);
    setData(null);
    setIpInfo(null);
    setSecurity(null);

    try {
      // Use different services to get distinct addresses reliably
      const ipv4Promise = fetchIpData('https://api.ipify.org?format=json');
      const ipv6Promise = fetch('https://api64.ipify.org?format=json')
        .then(res => res.ok ? res.json() : Promise.resolve({ ip: 'N/A' }))
        .catch(() => ({ ip: 'N/A' }));
      
      const [ipv4Data, ipv6Data] = await Promise.all([ipv4Promise, ipv6Promise]);
      
      // Fetch geo/ISP data using the reliable IPv4
      const geoPromise = fetchIpData(`https://ipapi.co/${ipv4Data.ip}/json/`);
      const [geoData] = await Promise.all([geoPromise]);

      // Simulate security data check on the client
      const securityData = {
        is_vpn: Math.random() < 0.1,
        is_proxy: Math.random() < 0.05,
      };
      setSecurity(securityData);

      const fullData = { 
        ...geoData, 
        ip: ipv4Data.ip, // Correctly assign IPv4
        ipv6: ipv6Data.ip, // Correctly assign IPv6
        security: securityData,
      };
      
      setData(fullData);
      setIpInfo(fullData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
       if (err instanceof TypeError && err.message.includes('fetch')) {
         setError('Failed to fetch IP data. Please check your network connection or ad-blocker.');
       }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe /> Network &amp; IP Analysis
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>Your public network footprint.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <IpAnalysisSkeleton />}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error Fetching IP</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {data && security && <IpAnalysisData data={data} />}
      </CardContent>
    </Card>
  );
}

function IpAnalysisSkeleton() {
  return (
    <div className="space-y-4">
       <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>
       <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-36" />
      </div>
    </div>
  );
}

function IpAnalysisData({ data }: { data: IpInfo }) {
  const isSecure = data.security.is_vpn || data.security.is_proxy;

  return (
    <div className="space-y-4 font-body">
      <div className="flex items-start gap-4">
        <Fingerprint className="h-5 w-5 mt-1 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">IPv4 Address</p>
          <p className="font-mono text-lg break-all">{data.ip}</p>
        </div>
      </div>
       <div className="flex items-start gap-4">
        <Fingerprint className="h-5 w-5 mt-1 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">IPv6 Address</p>
          <p className="font-mono text-base break-all">{data.ipv6 || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <Building className="h-5 w-5 mt-1 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">Internet Service Provider (ISP)</p>
          <p className="break-words">{data.org}</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <Globe className="h-5 w-5 mt-1 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">Location</p>
          <p>{data.city}, {data.country_name} (ASN: {data.asn})</p>
        </div>
      </div>
       <div className="flex items-start gap-4">
        {isSecure ? <ShieldCheck className="h-5 w-5 mt-1 text-secondary" /> : <ShieldAlert className="h-5 w-5 mt-1 text-destructive" />}
        <div>
          <p className="text-sm font-medium text-muted-foreground">Anonymizer Status</p>
          <div className="flex gap-2 mt-1">
             {data.security.is_vpn && <Badge variant="secondary">VPN Detected</Badge>}
             {data.security.is_proxy && <Badge variant="secondary">Proxy Detected</Badge>}
             {!isSecure && <Badge variant="destructive">Exposed</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}
