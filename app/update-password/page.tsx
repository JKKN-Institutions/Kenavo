'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle, CheckCircle, Loader2, KeyRound } from 'lucide-react';
import { updatePassword, getUser } from '@/lib/auth/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user is authenticated (should be from password reset flow)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { user, error } = await getUser();

      if (error || !user) {
        console.error('Not authenticated for password update');
        setMessage({
          type: 'error',
          text: 'Invalid or expired password reset link. Please request a new one.',
        });
        setCheckingAuth(false);

        // Redirect to forgot password after 3 seconds
        setTimeout(() => {
          router.push('/forgot-password');
        }, 3000);
        return;
      }

      console.log('User authenticated for password update:', user.email);
      setCheckingAuth(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      setCheckingAuth(false);
    }
  };

  // Auto-redirect after successful password update
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!newPassword || !confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Please fill in all fields',
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);
    setMessage({
      type: 'info',
      text: 'Updating your password...',
    });

    try {
      console.log('Updating password...');
      const { error } = await updatePassword(newPassword);

      if (error) {
        console.error('Password update error:', error);
        setMessage({
          type: 'error',
          text: `Failed to update password: ${error.message}`,
        });
        setLoading(false);
        return;
      }

      console.log('✅ Password updated successfully');
      setMessage({
        type: 'success',
        text: 'Password updated successfully! Redirecting to login...',
      });
      setSuccess(true);

    } catch (error: any) {
      console.error('Unexpected password update error:', error);
      setMessage({
        type: 'error',
        text: `Error: ${error.message || 'An unexpected error occurred'}`,
      });
      setLoading(false);
    }
  };

  // Loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-purple-300 mx-auto mb-4" />
          <p className="text-white text-lg">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Password Updated!</h1>
            <p className="text-purple-200 mb-2">
              Your password has been updated successfully.
            </p>
            <p className="text-purple-300 text-sm">
              Redirecting to login page in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Update password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Update Password Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <KeyRound size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Update Password</h1>
            <p className="text-purple-200">Enter your new password below</p>
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

          {/* Password Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Input */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-purple-200 mb-2">
                New Password * (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-200 mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-3 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <KeyRound size={20} />
                  Update Password
                </>
              )}
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-purple-200 text-sm font-semibold mb-2">Password Requirements:</p>
            <ul className="text-purple-300 text-sm space-y-1">
              <li>• Minimum 6 characters</li>
              <li>• Passwords must match</li>
            </ul>
          </div>
        </div>

        {/* Helper Info */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100 text-sm">
          <p className="font-semibold mb-2">🔒 Security Tip</p>
          <p>
            Choose a strong password that you haven&apos;t used elsewhere. After updating, you&apos;ll be redirected to the login page.
          </p>
        </div>
      </div>
    </div>
  );
}
