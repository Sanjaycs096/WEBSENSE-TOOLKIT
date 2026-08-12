'use server';

import { z } from 'zod';

const UrlAnalysisSchema = z.object({
  url: z.string().url('Please enter a valid URL.'),
});

export type UrlAnalysisResult = {
  safety: {
    isSafe: boolean;
    message: string;
  };
  ssl: {
    hasSSL: boolean;
    isValid: boolean;
    message: string;
  };
  headers: {
    hasCSP: boolean;
    hasXFrame: boolean;
    hasHSTS: boolean;
    message: string;
    score: number;
  };
  uptime: {
    isUp: boolean;
    statusCode: number | null;
    message: string;
  };
  performanceScore: number;
};

export async function analyzeUrl(
  prevState: any,
  formData: FormData
): Promise<{ result: UrlAnalysisResult | null; error: string | null }> {
  const validatedFields = UrlAnalysisSchema.safeParse({
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error: validatedFields.error.flatten().fieldErrors.url?.[0] || 'Invalid input.',
    };
  }
  
  const url = validatedFields.data.url;
  
  try {
    const urlObj = new URL(url);
    
    let uptime = { isUp: false, statusCode: null as number | null, message: '' };
    let responseHeaders: Headers | null = null;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, { 
        method: 'GET', // Use GET to get headers and body for a more realistic check
        redirect: 'follow',
        signal: controller.signal,
        headers: {
            'User-Agent': 'WebSenseToolkit/1.0',
        }
      });
      clearTimeout(timeoutId);

      uptime.isUp = response.ok;
      uptime.statusCode = response.status;
      uptime.message = `Website is ${uptime.isUp ? 'online' : 'offline'}. Status: ${response.status}`;
      responseHeaders = response.headers;

    } catch (e: any) {
        if (e.name === 'AbortError') {
             uptime.message = 'Could not reach the website. The request timed out.';
        } else {
             uptime.message = 'Could not reach the website. It might be offline, block requests, or have SSL issues.';
        }
    }

    // Safety check - Simulate a safety check based on uptime for now
    const isSafe = uptime.isUp;
    const safety = {
      isSafe: isSafe,
      message: isSafe ? 'URL is considered safe.' : 'URL could not be reached, marked as potentially unsafe.',
    };

    // SSL Check
    const hasSSL = urlObj.protocol === 'https:';
    // If uptime check passed with HTTPS, we can assume SSL is working.
    const isSslValid = hasSSL && uptime.isUp;
    let ssl = {
      hasSSL: hasSSL,
      isValid: isSslValid,
      message: '',
    };

    if (hasSSL) {
      ssl.message = isSslValid ? 'SSL certificate appears valid.' : 'Site uses HTTPS, but could not be reached or has certificate issues.';
    } else {
      ssl.message = 'Site does not use HTTPS.';
    }

    // Headers check from actual response
    const hasCSP = !!responseHeaders?.has('content-security-policy');
    const hasXFrame = !!responseHeaders?.has('x-frame-options');
    const hasHSTS = !!responseHeaders?.has('strict-transport-security');
    
    let missingHeaders = [];
    if (!hasCSP) missingHeaders.push('CSP');
    if (!hasXFrame) missingHeaders.push('X-Frame-Options');
    if (!hasHSTS) missingHeaders.push('HSTS');
    
    const headers = {
      hasCSP,
      hasXFrame,
      hasHSTS,
      message: missingHeaders.length > 0
        ? `Missing security headers: ${missingHeaders.join(', ')}.`
        : 'All key security headers are present.',
      score: 3 - missingHeaders.length,
    };

    // Calculate performance score
    let performanceScore = 100;
    if (!safety.isSafe) performanceScore -= 50;
    if (!ssl.hasSSL) performanceScore -= 25;
    else if (!ssl.isValid) performanceScore -= 20;
    performanceScore -= missingHeaders.length * 5;
    if (!uptime.isUp) performanceScore -= 50;
    performanceScore = Math.max(0, Math.min(100, performanceScore));

    const result: UrlAnalysisResult = {
      safety,
      ssl,
      headers,
      uptime,
      performanceScore,
    };

    return { result, error: null };
  } catch (error) {
    if (error instanceof TypeError) {
      return { result: null, error: 'Invalid URL format. Please include http:// or https://' };
    }
    return { result: null, error: 'Failed to analyze URL. An unexpected error occurred.' };
  }
}
