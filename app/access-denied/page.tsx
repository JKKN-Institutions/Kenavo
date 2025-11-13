'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldX, Home, LogIn, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason') || 'unknown';

  const getReasonMessage = () => {
    switch (reason) {
      case 'no_permission':
        return {
          title: 'Access Not Granted',
          message: 'You do not have permission to access the directory. Please contact an administrator to request access.',
          icon: <ShieldX size={64} className="text-red-400" />,
        };
      case 'account_inactive':
        return {
          title: 'Account Inactive',
          message: 'Your account has been deactivated. Please contact an administrator for assistance.',
          icon: <AlertTriangle size={64} className="text-yellow-400" />,
        };
      case 'directory_access_denied':
        return {
          title: 'Directory Access Denied',
          message: 'Directory access has not been enabled for your account. Please contact an administrator to request access.',
          icon: <ShieldX size={64} className="text-red-400" />,
        };
      case 'error':
        return {
          title: 'Access Error',
          message: 'An error occurred while checking your permissions. Please try again or contact support.',
          icon: <AlertTriangle size={64} className="text-orange-400" />,
        };
      default:
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this page.',
          icon: <ShieldX size={64} className="text-red-400" />,
        };
    }
  };

  const reasonInfo = getReasonMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {reasonInfo.icon}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          {reasonInfo.title}
        </h1>

        {/* Message */}
        <p className="text-white/80 text-lg mb-8">
          {reasonInfo.message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-all border border-white/30"
          >
            <Home size={20} />
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all"
          >
            Go Back
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-white/60 text-sm">
            If you believe this is a mistake, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <AccessDeniedContent />
    </Suspense>
  );
}
