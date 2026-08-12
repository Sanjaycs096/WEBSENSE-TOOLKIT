'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, BarChart, Wifi, Lock, Cpu, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { Header } from '@/components/dashboard/Header';

export default function LandingPage() {
  const features = [
    {
      icon: <LinkIcon className="w-6 h-6" />,
      title: 'URL & Website Analyzer',
      description: 'Check any URL for safety, performance, and security headers.',
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: 'Internet Speed Test',
      description: 'Measure your connection’s download and upload performance.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Network & IP Analysis',
      description: 'Get insights into your public network footprint and detect VPNs.',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Password Toolkit',
      description: 'Generate strong passwords and check for potential leaks.',
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'AI Image Authenticity',
      description: 'Detect if an image is AI-generated or a real photograph.',
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: 'Unified Safety Score',
      description: 'Get a single score that represents your overall digital safety.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header sections={{}} />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Your Digital Safety Dashboard
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    WebSense Toolkit is your all-in-one solution for digital safety, offering tools for network analysis, security checks, and AI-powered threat detection.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                     <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
              <img
                src="/hero-cyber-security.jpg"
                width="600"
                height="400"
                alt="Stylized graphic showing a digital security shield protecting data"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A Comprehensive Security Suite
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From network analysis to AI-powered image detection, get the insights you
                  need to stay safe online.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                   <div className="text-primary">{feature.icon}</div>
                  <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Secure Your Digital Life?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create a free account to access the full toolkit, save your scan history, and track your safety score over time.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
                <Button asChild size="lg">
                    <Link href="/signup">
                      Sign Up for Free
                    </Link>
                  </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2026 WebSense Toolkit. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
