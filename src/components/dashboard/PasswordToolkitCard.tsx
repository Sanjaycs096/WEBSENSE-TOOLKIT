'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Lock, Sparkles, ShieldOff, Copy, Check, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ScoreWeights } from '@/lib/types';

type Props = {
  onScanComplete: (scanType: string, scoreToAdd: number, summary: string) => void;
  weights: ScoreWeights['password'];
};

const COMMON_PASSWORDS = [
  "123456", "123456789", "password", "12345", "12345678", "qwerty", 
  "1234567", "111111", "iloveyou", "123123", "1234567890", "admin",
  "senha123", "picture1", "1234", "dragon", "sunshine", "football",
  "princess", "master"
];

const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return { score: 0, label: 'Empty', color: 'bg-destructive' };

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score < 3) return { score: (score / 5) * 100, label: 'Weak', color: 'bg-destructive' };
  if (score < 5) return { score: (score / 5) * 100, label: 'Medium', color: 'bg-yellow-500' };
  return { score: 100, label: 'Strong', color: 'bg-secondary' };
};

const checkPwnedPassword = (password: string) => {
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return true;
  }
  const hash = password.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 100) < 5;
};

export function PasswordToolkitCard({ onScanComplete, weights }: Props) {
  const [password, setPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [leakCheckResult, setLeakCheckResult] = useState<string | null>(null);
  const [isCheckingLeak, setIsCheckingLeak] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const generatePassword = useCallback(() => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,./<>?';

    let charset = lower + upper;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    let newPassword = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(randomValues[i] % charset.length);
    }
    setGeneratedPassword(newPassword);
    onScanComplete('password_generator', weights.generator, 'Password Generated');
  }, [length, includeNumbers, includeSymbols, onScanComplete, weights.generator]);

  useEffect(() => {
    if (isMounted) {
      generatePassword();
    }
  }, [isMounted, generatePassword]);

  const strength = checkPasswordStrength(password);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLeakCheckResult(null);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLeakCheck = () => {
    if (!password) {
      toast({ variant: 'destructive', title: 'Please enter a password' });
      return;
    }
    setIsCheckingLeak(true);
    setLeakCheckResult(null);
    setTimeout(() => {
      const isLeaked = checkPwnedPassword(password);
      setLeakCheckResult(isLeaked ? 'Password found in a data breach!' : 'Good news! This password was not found in any known data breaches.');
      onScanComplete('password_leak', weights.leak, isLeaked ? 'Leaked' : 'Not found');
      setIsCheckingLeak(false);
    }, 1000);
  };

  const handleStrengthCheck = () => {
    if (password) {
      const { label } = strength;
      onScanComplete('password_strength', weights.strength, label);
    }
  };

  if (!isMounted) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock /> Password Toolkit
          </CardTitle>
          <CardDescription>Check, generate, and verify password security.</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock /> Password Toolkit
        </CardTitle>
        <CardDescription>Check, generate, and verify password security.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Tabs defaultValue="strength" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="leak">Leak Check</TabsTrigger>
          </TabsList>
          <TabsContent value="strength" className="flex-grow flex flex-col justify-between mt-4">
            <div className="space-y-4">
              <Label htmlFor="password-input">Enter password to check</Label>
              <Input id="password-input" type="password" value={password} onChange={handlePasswordChange} onBlur={handleStrengthCheck} />
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Strength: {strength.label}</span>
                </div>
                <Progress value={strength.score} className={`h-2 ${strength.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">All checks are performed client-side. Your passwords are never sent to our servers.</p>
          </TabsContent>
          <TabsContent value="generator" className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="length">Length:</Label>
              <Input id="length" type="number" value={length} onChange={(e) => setLength(parseInt(e.target.value) || 0)} className="w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)} />
              <Label htmlFor="include-numbers">Include Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)} />
              <Label htmlFor="include-symbols">Include Symbols (!@#...)</Label>
            </div>
            <Button onClick={generatePassword}><Sparkles className="mr-2 h-4 w-4" /> Generate</Button>
            {generatedPassword && (
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                <span className="font-mono text-sm flex-grow break-all">{generatedPassword}</span>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  {isCopied ? <Check className="h-4 w-4 text-secondary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </TabsContent>
           <TabsContent value="leak" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">Check if your password has appeared in a data breach using a secure, simulated method.</p>
            <Input id="password-leak-input" type="password" placeholder="Enter password to check" value={password} onChange={handlePasswordChange} />
            <Button onClick={handleLeakCheck} disabled={isCheckingLeak || !password} className="w-full">
              {isCheckingLeak ? 'Checking...' : 'Check for Leaks'}
            </Button>
            {leakCheckResult && (
              <div className={`flex items-start gap-2 text-sm p-3 rounded-md ${leakCheckResult.includes('Good news') ? 'bg-secondary/20 text-green-700' : 'bg-destructive/20 text-red-500'}`}>
                {leakCheckResult.includes('Good news') ? <ShieldCheck className="h-5 w-5 mt-0.5 text-secondary" /> : <ShieldOff className="h-5 w-5 mt-0.5 text-destructive" />}
                <p>{leakCheckResult}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
                This check is simulated. In a real scenario, we would use a k-anonymity model to protect your password's privacy.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
