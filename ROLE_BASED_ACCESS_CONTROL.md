# Role-Based Access Control (RBAC) System Documentation

## Overview
The Kenavo Alumni Directory now implements a comprehensive role-based access control system with two distinct user roles: **Admin** and **User**. This system provides fine-grained control over user permissions and access to different parts of the application.

## User Roles

### 1. Admin Role
**Full system access with management capabilities**

**Permissions:**
- ✅ Access admin panel at `/admin-panel`
- ✅ Create, edit, and delete users
- ✅ Manage all alumni profiles
- ✅ Bulk upload profiles
- ✅ Gallery management
- ✅ Contact form management
- ✅ Full directory access (always granted)
- ✅ View all system analytics

**How to create admin users:**
1. Via Admin Panel: Select "Admin (Full System Access)" when creating a user
2. Via Database: Set `role = 'admin'` in the `app_users` table
3. Via Environment Variable: Add email to `ADMIN_EMAILS` (backward compatibility)

### 2. User Role (Regular User)
**Directory access based on admin-granted permissions**

**Permissions:**
- ✅ View directory listing (if `has_directory_access = true`)
- ✅ View individual alumni profiles
- ✅ Browse public pages (Home, About Us, Gallery, Contact Us)
- ❌ No admin panel access
- ❌ Cannot manage profiles
- ❌ Cannot manage other users

**Access Requirements:**
- Must have `has_directory_access = true` (controlled by admin)
- Must have `status = 'active'`
- Must be authenticated

## Database Schema

### app_users Table
```sql
CREATE TABLE app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  has_directory_access BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields:**
- `role`: Defines user type ('admin' or 'user')
- `has_directory_access`: Controls directory access for regular users
- `status`: Account status ('active' or 'inactive')

## Access Control Implementation

### 1. Admin Check Function
**Location:** `lib/auth/server.ts`

```typescript
export async function isAdmin() {
  const { user } = await getUser();
  if (!user) return false;

  // Check 1: Email whitelist (backward compatibility)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (adminEmails.includes(user.email || '')) {
    return true;
  }

  // Check 2: Database role
  const { data: appUser } = await supabase
    .from('app_users')
    .select('role, status')
    .eq('id', user.id)
    .single();

  return appUser?.role === 'admin' && appUser?.status === 'active';
}
```

**Logic Flow:**
1. First checks `ADMIN_EMAILS` environment variable
2. Then checks `app_users.role = 'admin'`
3. Requires `status = 'active'`

### 2. API Route Protection
**Location:** `lib/auth/api-protection.ts`

```typescript
export async function protectAdminRoute() {
  const { user } = await getUser();
  if (!user) return 401 Unauthorized;

  const admin = await isAdmin();
  if (!admin) return 403 Forbidden;

  return null; // Authorized
}
```

**Usage in API routes:**
```typescript
export async function POST(request: NextRequest) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  // Your protected logic here
}
```

### 3. Directory Layout Protection
**Location:** `app/directory/layout.tsx`

**Access Logic:**
```typescript
// Step 1: Must be authenticated
if (!user) redirect('/login');

// Step 2: Admins always have access
if (await isAdmin()) return <>{children}</>;

// Step 3: Regular users need permission
const appUser = await getAppUser(user.id);
if (appUser.status !== 'active') redirect('/access-denied?reason=account_inactive');
if (!appUser.has_directory_access) redirect('/access-denied?reason=directory_access_denied');

return <>{children}</>;
```

### 4. Login Redirect Logic
**Location:** `app/login/page.tsx`

```typescript
// After successful authentication:
if (await isAdmin()) {
  router.push('/admin-panel');  // Admins → Admin Panel
} else {
  router.push('/directory');     // Users → Directory
}
```

## User Management Interface

### Admin Panel - Users Tab
**Location:** `components/admin/UserManagementTab.tsx`

**Features:**
- ✅ Create new users with role selection
- ✅ Edit existing users (role, permissions, status)
- ✅ Delete users
- ✅ Search by email or username
- ✅ Filter by status (active/inactive)
- ✅ View user details (role badge, permissions, status)
- ✅ Pagination support

**Role Display:**
- Admin role: Purple badge with shield icon
- User role: Gray badge with user icon

### User Form Modal
**Location:** `components/admin/UserFormModal.tsx`

**Role Selector:**
```typescript
<select name="role" value={formData.role} onChange={handleInputChange}>
  <option value="user">User (Directory Access Only)</option>
  <option value="admin">Admin (Full System Access)</option>
</select>
```

**Role Descriptions:**
- **Admin:** Access to admin panel and all features
- **User:** Access to directory based on permission

## Migration Guide

### Applying the Role Migration

**Step 1: Run the migration**
```sql
-- File: supabase/migrations/016_add_role_to_app_users.sql
ALTER TABLE app_users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('admin', 'user'));

-- Update existing users (optional)
UPDATE app_users
SET role = 'admin'
WHERE email IN (SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ',')));
```

**Step 2: Verify migration**
```sql
-- Check column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'app_users' AND column_name = 'role';

-- View all users with roles
SELECT id, email, role, has_directory_access, status FROM app_users;
```

### Migrating Existing Users

**Option 1: Keep all existing users as regular users**
- All existing users will have `role = 'user'` by default
- Only users in `ADMIN_EMAILS` will be admins

**Option 2: Promote specific users to admin**
```sql
UPDATE app_users
SET role = 'admin'
WHERE email IN ('admin1@example.com', 'admin2@example.com');
```

## Testing Checklist

### Admin User Tests
- [ ] Admin can access `/admin-panel`
- [ ] Admin can create new users with both roles
- [ ] Admin can edit user roles
- [ ] Admin can grant/revoke directory access
- [ ] Admin can view all profiles
- [ ] Admin can manage gallery and contacts

### Regular User Tests
- [ ] User with `has_directory_access = true` can view `/directory`
- [ ] User with `has_directory_access = false` is blocked from `/directory`
- [ ] User with `status = 'inactive'` cannot access directory
- [ ] User cannot access `/admin-panel` (403 error)
- [ ] User can view public pages without authentication
- [ ] User redirected to `/directory` after login (not admin panel)

### API Protection Tests
- [ ] Unauthenticated requests to `/api/admin/*` return 401
- [ ] Regular user requests to `/api/admin/*` return 403
- [ ] Admin requests to `/api/admin/*` succeed
- [ ] Creating user without password fails
- [ ] Invalid email format is rejected
- [ ] Duplicate email is rejected

## Troubleshooting

### Issue: "column role does not exist"
**Solution:** Run the migration script `016_add_role_to_app_users.sql`

### Issue: Regular user can access admin panel
**Solution:** Check the `isAdmin()` function is updated and role is set correctly in database

### Issue: Admin cannot access admin panel
**Solution:**
1. Check `ADMIN_EMAILS` environment variable
2. Verify `role = 'admin'` in database
3. Ensure `status = 'active'`

### Issue: User cannot login after role migration
**Solution:** Ensure user exists in both `auth.users` AND `app_users` tables

## Security Considerations

1. **Defense in Depth:** Access control implemented at multiple layers:
   - API route protection
   - Layout-level protection
   - Page-level checks
   - Client-side redirects

2. **Backward Compatibility:** `ADMIN_EMAILS` still works for existing admins

3. **Status Checking:** Users must be `active` for both admin checks and directory access

4. **Service Role Usage:** Admin operations use `supabaseAdmin` to bypass RLS policies

5. **Password Requirements:** Minimum 6 characters enforced

## Environment Variables

```bash
# Required for backward compatibility
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API Endpoints

### User Management APIs

**GET /api/admin/users**
- List all users with pagination
- Query params: `page`, `limit`, `search`, `status`
- Returns: `{ users, total, page, totalPages }`

**POST /api/admin/users**
- Create new user
- Body: `{ email, password, username?, role?, has_directory_access?, status? }`
- Creates user in both `auth.users` and `app_users`
- Implements rollback on failure

**GET /api/admin/users/[id]**
- Get single user details
- Returns: `{ user }`

**PUT /api/admin/users/[id]**
- Update user details
- Body: `{ email?, username?, password?, role?, has_directory_access?, status? }`
- Updates both `auth.users` and `app_users`

**DELETE /api/admin/users/[id]**
- Delete user from both tables
- Returns: `{ message }`

## Future Enhancements

Potential improvements for the RBAC system:

1. **Additional Roles:**
   - Moderator role (limited admin access)
   - Alumni role vs Guest role
   - Year-based access groups

2. **Granular Permissions:**
   - Separate permissions for different features
   - Permission matrix (e.g., can_edit_profiles, can_manage_gallery)

3. **Audit Logging:**
   - Track role changes
   - Log access attempts
   - Record admin actions

4. **Self-Service Features:**
   - User profile editing
   - Password reset flow
   - Account activation emails

## Summary

The role-based access control system provides:
- ✅ Clear separation between admin and regular users
- ✅ Flexible directory access management
- ✅ Backward compatibility with existing admin authentication
- ✅ Comprehensive API and UI protection
- ✅ User-friendly management interface
- ✅ Proper error handling and user feedback

For questions or issues, refer to the troubleshooting section or check the implementation files referenced throughout this document.
