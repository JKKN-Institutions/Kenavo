'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, AlertCircle, CheckCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { resetPassword } from '@/lib/auth/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!email) {
      setMessage({
        type: 'error',
        text: 'Please enter your email address',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address',
      });
      return;
    }

    setLoading(true);
    setMessage({
      type: 'info',
      text: 'Sending password reset email...',
    });

    try {
      console.log('Requesting password reset for:', email);
      const { error } = await resetPassword(email);

      if (error) {
        console.error('Password reset error:', error);
        setMessage({
          type: 'error',
          text: `Failed to send reset email: ${error.message}`,
        });
        setLoading(false);
        return;
      }

      console.log('✅ Password reset email sent');
      setMessage({
        type: 'success',
        text: 'Password reset email sent! Please check your inbox.',
      });
      setEmailSent(true);
      setLoading(false);

    } catch (error: any) {
      console.error('Unexpected password reset error:', error);
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
        {/* Forgot Password Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <KeyRound size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-purple-200">
              {emailSent
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive a password reset link'}
            </p>
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
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {!emailSent ? (
            // Email Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-3 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            // Success Message with Actions
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-100">
                <p className="text-sm mb-2">
                  If an account exists with that email, you&apos;ll receive a password reset link shortly.
                </p>
                <p className="text-sm">
                  Please check your spam folder if you don&apos;t see the email.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setMessage(null);
                    setEmail('');
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-all"
                >
                  Try Different Email
                </button>

                <Link
                  href="/login"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold text-center transition-all"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          )}

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-purple-200 text-sm text-center">
              Remember your password?{' '}
              <Link href="/login" className="text-purple-300 hover:text-purple-100 font-semibold underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Helper Info */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100 text-sm">
          <p className="font-semibold mb-2">🔒 Security Note</p>
          <p>
            For security reasons, we don&apos;t reveal whether an email exists in our system. The reset link will expire in 1 hour.
          </p>
        </div>
      </div>
    </div>
  );
}
