import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import DirectoryClient from './DirectoryClient';

export default async function DirectoryPage() {
  // Server-side authentication check - happens BEFORE page loads
  const { user } = await getUser();

  if (!user) {
    // Not authenticated - redirect to login
    redirect('/login?redirect=/directory');
  }

  // Check if user has directory access
  const { data: appUser, error: userError } = await supabaseAdmin
    .from('app_users')
    .select('id, email, username, has_directory_access, status')
    .eq('id', user.id)
    .single();

  if (userError || !appUser) {
    // User not found in app_users table - redirect to login for registration
    redirect('/login?redirect=/directory');
  }

  // Check if account is active
  if (appUser.status !== 'active') {
    redirect('/access-denied?reason=account_inactive');
  }

  // Check directory access permission
  if (!appUser.has_directory_access) {
    redirect('/access-denied?reason=directory_access_denied');
  }

  // User has access - render the client component
  return <DirectoryClient />;
}
