import { Header } from '@/components/dashboard/Header';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header sections={{}} />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
            <h1 className="font-headline">Terms and Conditions</h1>
            <p className="text-muted-foreground">Last updated: July 26, 2026</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using WebSense Toolkit (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              WebSense Toolkit provides a suite of tools for informational and educational purposes related to digital security and privacy. The tools and recommendations are based on automated analysis and publicly available information.
            </p>

            <h2>3. Informational Purposes Only</h2>
            <p>
              <strong>No Guarantee of Security:</strong> The information, scores, and recommendations provided by the Service are for informational purposes only. They are not a guarantee of security or a substitute for professional cybersecurity advice. While we strive for accuracy, the digital landscape is constantly changing, and we cannot guarantee that our analysis will be comprehensive or error-free.
            </p>

            <h2>4. User Responsibility</h2>
            <p>
              You are solely responsible for your actions and decisions based on the information provided by the Service. WebSense Toolkit and its creators shall not be liable for any damages or losses that may arise from your use of the Service or your reliance on the information it provides.
            </p>

            <h2>5. Fair Usage and Abuse Prevention</h2>
            <p>
              You agree not to use the Service for any malicious purposes, including but not limited to:
            </p>
            <ul>
              <li>Performing an excessive number of scans in a short period (rate-limiting is in effect).</li>
              <li>Attempting to reverse-engineer or disrupt the Service.</li>
              <li>Using the Service to scan or analyze systems for which you do not have permission.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate this fair usage policy.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of WebSense Toolkit and its licensors.
            </p>

            <h2>7. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            
            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall WebSense Toolkit, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@websensetoolkit.example.com.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
