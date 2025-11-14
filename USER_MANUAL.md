Quick Start
Get up and running in 5 minutes
1
Install SDK
Add the bug reporter package to your project

2
Get API Key
Create an application and generate API key

3
Initialize
Wrap your app with BugReporterProvider

Installation
Configuration
Next.js Setup
Advanced
Step 3: Next.js Integration
Complete setup for Next.js 15 with App Router
3.1. Environment Variables
Create a .env.local file in your project root:

# JKKN Bug Reporter Configuration
NEXT_PUBLIC_BUG_REPORTER_API_KEY=br_your_api_key_here
NEXT_PUBLIC_BUG_REPORTER_API_URL=https://your-domain.com/api/v1/public
3.2. Root Layout Setup
Update your app/layout.tsx:

import { BugReporterProvider } from '@boobalan_jkkn/bug-reporter-sdk';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BugReporterProvider
          apiKey={process.env.NEXT_PUBLIC_BUG_REPORTER_API_KEY!}
          apiUrl={process.env.NEXT_PUBLIC_BUG_REPORTER_API_URL!}
          enabled={true}
          debug={process.env.NODE_ENV === 'development'}
          userContext={{
            userId: 'user-id-here', // Optional
            name: 'John Doe',       // Optional
            email: 'user@jkkn.ac.in' // Optional
          }}
        >
          {children}
        </BugReporterProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
3.3. With Supabase Authentication
For authenticated apps using Supabase:

'use client';

import { BugReporterProvider } from '@boobalan_jkkn/bug-reporter-sdk';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function BugReporterWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <BugReporterProvider
      apiKey={process.env.NEXT_PUBLIC_BUG_REPORTER_API_KEY!}
      apiUrl={process.env.NEXT_PUBLIC_BUG_REPORTER_API_URL!}
      enabled={true}
      userContext={user ? {
        userId: user.id,
        name: user.user_metadata?.full_name,
        email: user.email
      } : undefined}
    >
      {children}
    </BugReporterProvider>
  );
}
What You Get
🐛 Floating bug report button (bottom-right)
📸 Automatic screenshot capture
📝 Console logs auto-capture
👤 User context tracking
🌐 Browser and system info
Step 2: Get Your API Key
Generate API credentials from the JKKN Bug Reporter platform
1. Sign up / Log in
Go to platform login page and authenticate

2. Create Organization
Create a new organization (usually your department name) or join an existing one

3. Register Application
Navigate to Applications → New Application and register your app

Name:
Your application name
Slug:
unique-app-slug
Description:
Brief description of your app
4. Copy API Key
After creating the application, you'll receive an API key. Copy and save it securely.

br_xxxxxxxxxxxxxxxxxxxxxxxxxx
Security Warning
Never commit API keys to version control. Use environment variables to store sensitive credenti
Step 3: Next.js Integration
Complete setup for Next.js 15 with App Router
3.1. Environment Variables
Create a .env.local file in your project root:

# JKKN Bug Reporter Configuration
NEXT_PUBLIC_BUG_REPORTER_API_KEY=br_your_api_key_here
NEXT_PUBLIC_BUG_REPORTER_API_URL=https://your-domain.com/api/v1/public
3.2. Root Layout Setup
Update your app/layout.tsx:

import { BugReporterProvider } from '@boobalan_jkkn/bug-reporter-sdk';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BugReporterProvider
          apiKey={process.env.NEXT_PUBLIC_BUG_REPORTER_API_KEY!}
          apiUrl={process.env.NEXT_PUBLIC_BUG_REPORTER_API_URL!}
          enabled={true}
          debug={process.env.NODE_ENV === 'development'}
          userContext={{
            userId: 'user-id-here', // Optional
            name: 'John Doe',       // Optional
            email: 'user@jkkn.ac.in' // Optional
          }}
        >
          {children}
        </BugReporterProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
3.3. With Supabase Authentication
For authenticated apps using Supabase:

'use client';

import { BugReporterProvider } from '@boobalan_jkkn/bug-reporter-sdk';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function BugReporterWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <BugReporterProvider
      apiKey={process.env.NEXT_PUBLIC_BUG_REPORTER_API_KEY!}
      apiUrl={process.env.NEXT_PUBLIC_BUG_REPORTER_API_URL!}
      enabled={true}
      userContext={user ? {
        userId: user.id,
        name: user.user_metadata?.full_name,
        email: user.email
      } : undefined}
    >
      {children}
    </BugReporterProvider>
  );
}
What You Get
🐛 Floating bug report button (bottom-right)
📸 Automatic screenshot capture
📝 Console logs auto-capture
👤 User context tracking
🌐 Browser and system info
Advanced Configuration
Customize behavior and add advanced features
Custom Widget Styling
Override default styles using CSS classes:

/* globals.css */
.bug-reporter-widget {
  /* Custom floating button styles */
  bottom: 2rem !important;
  right: 2rem !important;
}

.bug-reporter-sdk {
  /* Custom modal/widget styles */
  font-family: 'Your Custom Font' !important;
}
Conditional Rendering
Show/hide bug reporter based on conditions:

<BugReporterProvider
  apiKey={process.env.NEXT_PUBLIC_BUG_REPORTER_API_KEY!}
  apiUrl={process.env.NEXT_PUBLIC_BUG_REPORTER_API_URL!}
  enabled={
    process.env.NODE_ENV === 'production' &&
    user?.role === 'beta-tester'
  }
  debug={false}
>
  {children}
</BugReporterProvider>
Add "My Bugs" Panel
Let users view their submitted bugs:

import { MyBugsPanel } from '@boobalan_jkkn/bug-reporter-sdk';

export default function ProfilePage() {
  return (
    <div>
      <h1>My Profile</h1>
      <MyBugsPanel />
    </div>
  );
}
Programmatic Bug Reporting
Trigger bug reports from code:

import { useBugReporter } from '@boobalan_jkkn/bug-reporter-sdk';

function MyComponent() {
  const { apiClient } = useBugReporter();

  const handleError = async (error: Error) => {
    try {
      await apiClient?.createBugReport({
        title: 'Automatic Error Report',
        description: error.message,
        page_url: window.location.href,
        category: 'error',
        console_logs: [],
      });
    } catch (err) {
      console.error('Failed to report bug:', err);
    }
  };

  return <button onClick={() => handleError(new Error('Test'))}>
    Report Error
  </button>;
}
Troubleshooting
Common issues and solutions
npm install shows 404 error?
• Clear npm cache: npm cache clean --force
• Wait 5-10 minutes if package was just published
• Try with explicit registry: npm install @boobalan_jkkn/bug-reporter-sdk --registry=https://registry.npmjs.org/
• Verify package exists at: npmjs.com

Widget not appearing?
• Check that enabled= is set
• Verify API key is correct
• Check browser console for errors
• Ensure API URL is reachable

API key validation failed?
• Verify API key starts with "br_"
• Check that application is active
• Ensure API URL matches platform URL
• Try regenerating the API key

Screenshots not capturing?
• Browser may block html2canvas library
• Check Content Security Policy (CSP)
• Verify no conflicting screenshot libraries