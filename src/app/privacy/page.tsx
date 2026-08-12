import { Header } from '@/components/dashboard/Header';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header sections={{}} />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
            <h1 className="font-headline">Privacy Policy for WebSense Toolkit</h1>
            <p className="text-muted-foreground">Last updated: July 26, 2026</p>

            <h2>Introduction</h2>
            <p>
              Welcome to WebSense Toolkit. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy sets out how we collect, use, and protect your personal information.
            </p>

            <h2>What Data We Collect</h2>
            <p>
              When you use our service, we collect the following information:
            </p>
            <ul>
              <li><strong>Account Information:</strong> When you sign up, we collect your email address to create and manage your account. Your password is handled securely by Firebase Authentication and is never visible to us.</li>
              <li><strong>Scan History:</strong> We store the results of the scans you perform (e.g., IP analysis, URL checks) to provide you with a historical overview of your safety score and activities. This data is associated with your user account.</li>
              <li><strong>Usage Data:</strong> We may collect anonymous data about how you interact with our tools to improve our services. This includes which tools are used most frequently, but not the specific data you enter into them.</li>
            </ul>

            <h2>What We DO NOT Collect or Store</h2>
            <p>
              We are committed to data minimization and your privacy. Therefore, we explicitly DO NOT collect or store the following sensitive information:
            </p>
            <ul>
              <li><strong>Passwords You Check:</strong> Passwords entered into the Password Toolkit for strength or leak checks are analyzed entirely within your browser (client-side) and are never sent to our servers or stored.</li>
              <li><strong>Images You Analyze:</strong> Images uploaded to the AI Image Authenticity Checker are sent to a third-party AI service for processing. They are processed temporarily and are not stored on our servers after the analysis is complete.</li>
              <li><strong>Personal Fingerprinting Data:</strong> We do not engage in browser or device fingerprinting for the purpose of tracking you across different sites. The information shown in the &quot;Digital Footprint&quot; visualizer is for educational purposes and is not stored.</li>
            </ul>
            
            <h2>Firebase Usage</h2>
             <p>
              We use Firebase for certain backend services. Specifically:
            </p>
            <ul>
                <li><strong>Firebase Authentication:</strong> Manages your login, signup, and session. It securely handles your credentials.</li>
                <li><strong>Firestore:</strong> Stores your user profile (email) and your scan history. All data is protected by security rules that ensure you can only access your own information.</li>
                 <li><strong>Cloud Functions for Firebase:</strong> Used for server-side logic such as generating smart recommendations. These functions operate under the same strict security rules.</li>
            </ul>

            <h2>Your Data Rights</h2>
            <p>
              You have control over your data. You have the right to:
            </p>
            <ul>
              <li><strong>Access Your Data:</strong> You can view your scan history at any time on your dashboard.</li>
              <li><strong>Delete Your Data:</strong> We provide an option in your account settings to permanently delete your entire account and all associated data, including your scan history. This action is irreversible.</li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@websensetoolkit.example.com.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
