# 🔐 Admin Authentication Setup Guide

## ✅ What Was Implemented

I've added secure authentication to protect your admin panel from unauthorized access. Here's what's now in place:

### **Security Features:**
1. ✅ **Login Page** - Email/password authentication at `/admin-panel/login`
2. ✅ **Protected Admin Panel** - Only logged-in admins can access `/admin-panel`
3. ✅ **Protected API Routes** - All `/api/admin/*` routes can be protected
4. ✅ **Email Whitelist** - Only authorized emails can access admin features
5. ✅ **Logout Functionality** - Secure logout button in admin panel
6. ✅ **Session Management** - Automatic session handling via Supabase Auth

---

## 📋 Setup Steps

### **Step 1: Create Admin User in Supabase**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `rihoufidmnqtffzqhplc`
3. Navigate to **Authentication** → **Users**
4. Click **Add User** → **Create new user**
5. Enter:
   - **Email**: `admin@kenavo.com` (or your preferred admin email)
   - **Password**: Choose a strong password (min 6 characters)
   - **Auto Confirm User**: ✅ Check this box
6. Click **Create User**

### **Step 2: Configure Admin Email Whitelist**

Your `.env.local` file now contains:

```env
ADMIN_EMAILS=admin@kenavo.com
```

**To add multiple admins**, use comma-separated emails:

```env
ADMIN_EMAILS=admin@kenavo.com,john@kenavo.com,sarah@kenavo.com
```

### **Step 3: Test the Authentication**

1. **Restart your dev server** (if running):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Try accessing admin panel**:
   - Go to: http://localhost:3001/admin-panel
   - You should be redirected to: http://localhost:3001/admin-panel/login

3. **Login**:
   - Email: `admin@kenavo.com`
   - Password: The password you set in Supabase
   - Click "Sign In"

4. **Verify access**:
   - You should be redirected to the admin panel
   - You should see all tabs (Manage, Bulk Update, Create, etc.)
   - You should see a "Logout" button in the top-right

5. **Test logout**:
   - Click the "Logout" button
   - You should be redirected back to login page

---

## 🔒 How It Works

### **Frontend Protection**

The admin panel has a layout that checks authentication:
- **File**: `app/admin-panel/layout.tsx`
- **Checks**:
  1. Is user logged in?
  2. Is user's email in the admin whitelist?
- **Redirects**: Unauthorized users to `/admin-panel/login`

### **API Protection** (Example)

API routes can be protected with one line:

```typescript
import { protectAdminRoute } from '@/lib/auth/api-protection';

export async function PUT(request: NextRequest) {
  // Add this line at the start of your API handler
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  // Your API logic here...
}
```

**Already Protected**:
- ✅ `/api/admin/update-profile/[id]` - Example implementation

**To Protect Other Routes**:
Just add the same 3 lines to the start of any admin API route.

---

## 🚀 Adding More Admins

### **Option 1: Via Supabase Dashboard** (Recommended)
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Check "Auto Confirm User"
5. Add the email to `.env.local`:
   ```env
   ADMIN_EMAILS=admin@kenavo.com,newemail@example.com
   ```
6. Restart dev server

### **Option 2: Via Signup (If you enable it)**
You could create a signup page, but for admin accounts, it's better to manually create them via Supabase Dashboard for security.

---

## 🛡️ Security Best Practices

### **DO:**
- ✅ Use strong passwords (12+ characters)
- ✅ Keep `.env.local` file secure (never commit to git)
- ✅ Use different passwords for each admin
- ✅ Regularly review admin access list
- ✅ Enable 2FA in Supabase for production

### **DON'T:**
- ❌ Share admin credentials
- ❌ Use simple passwords like "123456"
- ❌ Commit `.env.local` to version control
- ❌ Add untrusted emails to ADMIN_EMAILS

---

## 🧪 Testing Checklist

Test these scenarios to ensure everything works:

- [ ] **Unauthorized access blocked**
  - Try accessing `/admin-panel` without logging in → Should redirect to login

- [ ] **Login works**
  - Login with valid admin credentials → Should redirect to admin panel

- [ ] **Invalid login blocked**
  - Try logging in with wrong password → Should show error
  - Try logging in with non-admin email → Should show "Access Denied"

- [ ] **Logout works**
  - Click logout button → Should redirect to login and clear session

- [ ] **API protection works**
  - Try calling `/api/admin/update-profile/1` without auth → Should return 401

- [ ] **All admin features work**
  - Test all tabs: Manage, Bulk Update, Create, Bulk Create, Q&A
  - Ensure all existing functionality still works

---

## 📁 Files Modified/Created

### **New Files:**
```
lib/auth/client.ts              # Client-side auth utilities
lib/auth/server.ts              # Server-side auth utilities
lib/auth/api-protection.ts      # API route protection helper
app/admin-panel/layout.tsx      # Admin panel auth wrapper
app/admin-panel/login/page.tsx  # Login page
```

### **Modified Files:**
```
app/admin-panel/page.tsx                        # Added logout button
app/api/admin/update-profile/[id]/route.ts     # Example of API protection
.env.local                                      # Added ADMIN_EMAILS config
package.json                                    # Added @supabase/ssr dependency
```

---

## 🔧 Troubleshooting

### **Issue: "Unauthorized - Authentication required"**
**Solution**: Make sure you're logged in at `/admin-panel/login`

### **Issue: "Forbidden - Admin access required"**
**Solution**:
1. Check that your email is in `ADMIN_EMAILS` in `.env.local`
2. Restart the dev server after changing `.env.local`
3. Make sure the email matches exactly (case-sensitive)

### **Issue: "Invalid login credentials"**
**Solution**:
1. Verify the user exists in Supabase Dashboard → Authentication → Users
2. Make sure you're using the correct password
3. Check that "Confirm email" is enabled for the user

### **Issue: "Cannot find module '@supabase/ssr'"**
**Solution**:
```bash
npm install @supabase/ssr
```

### **Issue: Redirect loop or blank page**
**Solution**:
1. Clear browser cache and cookies
2. Check browser console for errors
3. Restart dev server
4. Try incognito/private browsing mode

---

## 🎯 Next Steps (Optional Enhancements)

1. **Protect All API Routes**:
   - Add `protectAdminRoute()` to all `/api/admin/*` routes

2. **Add Password Reset**:
   - Implement forgot password flow using Supabase Auth

3. **Add 2FA**:
   - Enable two-factor authentication in Supabase

4. **Add Role-Based Access**:
   - Create different admin levels (super admin, editor, viewer)
   - Store roles in database
   - Check roles in `isAdmin()` function

5. **Add Activity Logging**:
   - Log admin actions (who created/edited what)
   - Create audit trail table in database

6. **Add Session Timeout**:
   - Configure session duration in Supabase
   - Auto-logout after inactivity

---

## 📞 Support

If you encounter any issues:
1. Check this guide's troubleshooting section
2. Check browser console for errors (F12)
3. Check terminal for server errors
4. Verify Supabase configuration

---

**Last Updated**: 2025-01-05
**Version**: 1.0.0
