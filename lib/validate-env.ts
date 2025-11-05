/**
 * Environment Variable Validation Utility
 * Ensures all Supabase credentials are from the same project
 */

interface DecodedJWT {
  iss: string;
  ref: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decodes a JWT token without verification (for validation purposes only)
 */
function decodeJWT(token: string): DecodedJWT | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    return decoded as DecodedJWT;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Validates that all Supabase environment variables are properly configured
 * and belong to the same project
 */
export function validateSupabaseEnv(): void {
  const errors: string[] = [];

  // Check if all required environment variables are present
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    errors.push('❌ NEXT_PUBLIC_SUPABASE_URL is not defined');
  }

  if (!anonKey) {
    errors.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }

  if (!serviceRoleKey) {
    errors.push('❌ SUPABASE_SERVICE_ROLE_KEY is not defined');
  }

  // If any required variables are missing, throw error
  if (errors.length > 0) {
    console.error('\n🚨 Supabase Environment Variables Error:\n');
    errors.forEach(error => console.error(error));
    console.error('\nPlease check your .env.local file and ensure all required variables are set.\n');
    throw new Error('Missing required Supabase environment variables');
  }

  // Extract project reference from URL
  const urlMatch = supabaseUrl!.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
  if (!urlMatch) {
    errors.push('❌ NEXT_PUBLIC_SUPABASE_URL has invalid format');
  }
  const urlProjectRef = urlMatch?.[1];

  // Decode JWT tokens to verify project references
  const decodedAnon = decodeJWT(anonKey!);
  const decodedService = decodeJWT(serviceRoleKey!);

  if (!decodedAnon) {
    errors.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not a valid JWT token');
  }

  if (!decodedService) {
    errors.push('❌ SUPABASE_SERVICE_ROLE_KEY is not a valid JWT token');
  }

  // If decoding failed, throw error
  if (errors.length > 0) {
    console.error('\n🚨 Supabase Environment Variables Error:\n');
    errors.forEach(error => console.error(error));
    console.error('\nPlease verify your Supabase API keys are correct.\n');
    throw new Error('Invalid Supabase environment variables');
  }

  // Verify all credentials are from the same project
  const anonProjectRef = decodedAnon!.ref;
  const serviceProjectRef = decodedService!.ref;

  if (urlProjectRef !== anonProjectRef) {
    errors.push(
      `❌ Project mismatch: NEXT_PUBLIC_SUPABASE_URL (${urlProjectRef}) does not match NEXT_PUBLIC_SUPABASE_ANON_KEY (${anonProjectRef})`
    );
  }

  if (urlProjectRef !== serviceProjectRef) {
    errors.push(
      `❌ Project mismatch: NEXT_PUBLIC_SUPABASE_URL (${urlProjectRef}) does not match SUPABASE_SERVICE_ROLE_KEY (${serviceProjectRef})`
    );
  }

  if (anonProjectRef !== serviceProjectRef) {
    errors.push(
      `❌ Project mismatch: NEXT_PUBLIC_SUPABASE_ANON_KEY (${anonProjectRef}) does not match SUPABASE_SERVICE_ROLE_KEY (${serviceProjectRef})`
    );
  }

  // Verify roles are correct
  if (decodedAnon!.role !== 'anon') {
    errors.push(
      `❌ NEXT_PUBLIC_SUPABASE_ANON_KEY has incorrect role: ${decodedAnon!.role} (expected: anon)`
    );
  }

  if (decodedService!.role !== 'service_role') {
    errors.push(
      `❌ SUPABASE_SERVICE_ROLE_KEY has incorrect role: ${decodedService!.role} (expected: service_role)`
    );
  }

  // If there are any errors, throw
  if (errors.length > 0) {
    console.error('\n🚨 Supabase Environment Variables Error:\n');
    errors.forEach(error => console.error(error));
    console.error('\nPlease ensure all Supabase credentials are from the same project.');
    console.error('Visit https://app.supabase.com/project/_/settings/api to get the correct keys.\n');
    throw new Error('Supabase environment variable validation failed');
  }

  // Success!
  console.log('✅ Supabase environment variables validated successfully');
  console.log(`   Project: ${urlProjectRef}`);
  console.log(`   Anon key: Valid (role: ${decodedAnon!.role})`);
  console.log(`   Service key: Valid (role: ${decodedService!.role})`);
}
