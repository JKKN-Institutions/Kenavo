'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { signInWithGoogle, getUser } from '@/lib/auth/client';

// Separate component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Check if already logged in
  useEffect(() => {
    checkAuth();

    // Check for error messages from URL
    const error = searchParams?.get('error');
    if (error === 'auth_failed') {
      setMessage({
        type: 'error',
        text: 'Authentication failed. Please try again.',
      });
    } else if (error === 'access_denied') {
      setMessage({
        type: 'error',
        text: 'Access denied. Your email is not authorized for admin access.',
      });
    }
  }, [searchParams]);

  const checkAuth = async () => {
    const { user } = await getUser();
    if (user) {
      router.push('/admin-panel');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage({
      type: 'info',
      text: 'Redirecting to Google...',
    });

    try {
      console.log('Starting Google sign-in...');
      const { error } = await signInWithGoogle();

      if (error) {
        console.error('Google sign-in error:', error);
        setMessage({
          type: 'error',
          text: `Failed to sign in with Google: ${error.message}`,
        });
        setLoading(false);
        return;
      }

      // If no error, user will be redirected to Google
      // They'll come back via the auth callback
    } catch (error: any) {
      console.error('Unexpected Google sign-in error:', error);
      setMessage({
        type: 'error',
        text: `Error: ${error.message || 'An unexpected error occurred'}`,
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <LogIn size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-purple-200">Kenavo Alumni Directory</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-100'
                  : message.type === 'info'
                  ? 'bg-blue-500/20 text-blue-100'
                  : 'bg-red-500/20 text-red-100'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Redirecting to Google...
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Info Text */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-purple-200 text-sm text-center">
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>

        {/* Helper Info */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100 text-sm">
          <p className="font-semibold mb-2">🔐 Google Authentication</p>
          <p>
            Sign in with your authorized Google account to access the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
