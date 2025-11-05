import { redirect } from 'next/navigation';
import { getUser, isAdmin } from '@/lib/auth/server';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();

  // If not logged in, redirect to login page
  if (!user) {
    redirect('/login');
  }

  // Check if user is admin
  const admin = await isAdmin();

  if (!admin) {
    // User is logged in but not an admin
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-red-200 mb-6">
            You do not have permission to access the admin panel. This area is restricted to authorized administrators only.
          </p>
          <p className="text-red-300 text-sm">
            Logged in as: <strong>{user.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and is an admin - render the admin panel
  return <>{children}</>;
}
