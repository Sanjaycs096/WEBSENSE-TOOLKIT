'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { imageAuthenticityCheck, type ImageAuthenticityCheckOutput } from '@/ai/flows/image-authenticity-check';
import { Cpu, FileImage, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

type Props = {
  onScanComplete: () => void;
};

export function ImageAuthenticityCard({ onScanComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImageAuthenticityCheckOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit for GenAI
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select an image smaller than 4MB.',
        });
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalysis = async () => {
    if (!preview) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please select an image to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await imageAuthenticityCheck({ imageDataUri: preview });
      setResult(output);
      onScanComplete();
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. The model may be unavailable or the image format is not supported.');
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get a response from the AI model. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu /> AI Image Authenticity
        </CardTitle>
        <CardDescription>Detect if an image is AI-generated or a real photo.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 text-center bg-background/50">
          {preview ? (
            <div className="relative w-full h-48 mb-4">
              <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileImage className="w-12 h-12" />
              <p>Upload an image to check its authenticity</p>
              <p className="text-xs">Supports JPG, PNG, WEBP. Max 4MB.</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isLoading}>
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
          </div>
        </div>

        <Button onClick={handleAnalysis} disabled={isLoading || !preview} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
          Analyze Image
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert variant={result.isAiGenerated ? 'destructive' : 'default'} className="bg-card">
            <AlertTitle className="flex items-center justify-between">
              Analysis Result
              <Badge variant={result.isAiGenerated ? 'destructive' : 'secondary'}>
                {result.isAiGenerated ? 'Likely AI-Generated' : 'Likely Real'}
              </Badge>
            </AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <p>{result.explanation}</p>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Confidence</span>
                  <span>{result.confidencePercentage}%</span>
                </div>
                <Progress value={result.confidencePercentage} className="h-2" />
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
