# ✅ Verify and Test Role System

## Migration Status: ✅ COMPLETE
The `role` column has been successfully added to the `app_users` table.

## Step 1: Verify Database

Run this SQL in Supabase Dashboard to check your users:

```sql
-- View all users with their roles
SELECT
  id,
  email,
  role,
  has_directory_access,
  status,
  created_at
FROM app_users
ORDER BY created_at DESC;
```

**Expected Result:**
- All existing users should have `role = 'user'` (default value)
- If any users should be admins, you'll need to update them

## Step 2: Update Existing Admins (If Needed)

If you have existing users who should be admins, run:

```sql
-- Replace with your actual admin email(s)
UPDATE app_users
SET role = 'admin'
WHERE email IN ('your-admin-email@example.com');

-- Verify the update
SELECT email, role FROM app_users WHERE role = 'admin';
```

## Step 3: Restart Development Server

**Important:** You must restart your dev server to load the updated code.

```bash
# In your terminal:
# 1. Stop the current server (Ctrl+C)
# 2. Start it again:
npm run dev
```

## Step 4: Test in Admin Panel

### 4.1 Login and Check UI

1. **Open your browser:** http://localhost:3000
2. **Login as admin**
3. **Go to Admin Panel** → **Users tab**
4. **You should now see:**
   - A new **"Role"** column between "Username" and "Directory Access"
   - Role badges for each user:
     - 🛡️ Purple badge for Admin users
     - 👤 Gray badge for Regular users

### 4.2 Create a Test Admin User

1. Click **"Add New User"** button
2. Fill in the form:
   - **Email:** `testadmin@example.com`
   - **Username:** `testadmin`
   - **Password:** `Test123!`
   - **Role:** Select **"Admin (Full System Access)"** ⬅️ NEW FIELD!
   - **Directory Access:** ✅ Checked
   - **Account Status:** Active
3. Click **"Create User"**
4. ✅ You should see the new user in the table with an Admin badge

### 4.3 Create a Test Regular User

1. Click **"Add New User"** button
2. Fill in the form:
   - **Email:** `testuser@example.com`
   - **Username:** `testuser`
   - **Password:** `Test123!`
   - **Role:** Select **"User (Directory Access Only)"** ⬅️ This is the default
   - **Directory Access:** ✅ Checked
   - **Account Status:** Active
3. Click **"Create User"**
4. ✅ You should see the new user in the table with a User badge

### 4.4 Edit Existing User Role

1. Find any existing user in the table
2. Click the **Edit** button
3. You should see the **Role** dropdown in the edit form
4. Try changing the role
5. Click **"Save Changes"**
6. ✅ The role badge should update in the table

## Step 5: Test Access Control

### 5.1 Test Admin Access

1. **Logout** from your current admin account
2. **Login** with the test admin account: `testadmin@example.com` / `Test123!`
3. **Expected behavior:**
   - ✅ Redirects to `/admin-panel`
   - ✅ Can access all admin features
   - ✅ Can view/edit users
   - ✅ Can access directory

### 5.2 Test Regular User Access

1. **Logout** from the admin account
2. **Login** with the test user account: `testuser@example.com` / `Test123!`
3. **Expected behavior:**
   - ✅ Redirects to `/directory` (NOT `/admin-panel`)
   - ✅ Can view directory listing
   - ✅ Can view individual profiles
   - ❌ Cannot access `/admin-panel` (try manually: http://localhost:3000/admin-panel)
   - You should see: **403 Forbidden** or be redirected

### 5.3 Test Directory Access Control

1. While logged in as regular user, **logout**
2. As admin, edit the test user:
   - **Uncheck "Directory Access"**
   - Click **"Save Changes"**
3. **Login again** as `testuser@example.com`
4. **Expected behavior:**
   - ❌ Redirected to `/access-denied` page
   - Cannot view directory

5. **Logout**, login as admin, and **re-enable** directory access for testing

## Step 6: Check Console for Errors

Open browser DevTools (F12) and check:

1. **Console tab:** Should have no errors
2. **Network tab:** API calls to `/api/admin/users` should return 200 OK

## ✅ Verification Checklist

Check all that apply:

- [ ] Role column visible in Users table
- [ ] Admin badge shows purple shield icon
- [ ] User badge shows gray user icon
- [ ] Role dropdown appears in Create User form
- [ ] Role dropdown appears in Edit User form
- [ ] Can create admin users
- [ ] Can create regular users
- [ ] Can edit user roles
- [ ] Admin users redirect to `/admin-panel` after login
- [ ] Regular users redirect to `/directory` after login
- [ ] Regular users blocked from `/admin-panel`
- [ ] Directory access control works (can enable/disable)
- [ ] No console errors

## 🎉 Success Indicators

If all tests pass, you should see:

### In the Users Table:
```
Email                  | Username    | Role       | Directory Access | Status
-----------------------|-------------|------------|------------------|--------
testadmin@example.com  | testadmin   | 🛡️ Admin   | ✓ Granted       | ✓ Active
testuser@example.com   | testuser    | 👤 User    | ✓ Granted       | ✓ Active
```

### Role Dropdown in Form:
```
Role *
┌────────────────────────────────────────┐
│ User (Directory Access Only)           │
│ Admin (Full System Access)         ▼   │
└────────────────────────────────────────┘

💡 User: Access to directory based on permission
```

## 🐛 Troubleshooting

### Issue: Role column not showing
**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart dev server

### Issue: "Cannot read property 'role' of undefined"
**Solution:**
1. Make sure dev server was restarted after migration
2. Check if all users have the role field:
   ```sql
   SELECT email, role FROM app_users WHERE role IS NULL;
   ```
3. If any NULL values, update them:
   ```sql
   UPDATE app_users SET role = 'user' WHERE role IS NULL;
   ```

### Issue: Regular user still accessing admin panel
**Solution:**
1. Check database:
   ```sql
   SELECT email, role FROM app_users WHERE email = 'testuser@example.com';
   ```
2. Should be `role = 'user'` not `'admin'`
3. Clear browser cookies and login again

### Issue: Admin cannot access admin panel
**Solution:**
1. Check `ADMIN_EMAILS` in your `.env.local`:
   ```
   ADMIN_EMAILS=your-admin@example.com,testadmin@example.com
   ```
2. OR check database role:
   ```sql
   SELECT email, role, status FROM app_users WHERE email = 'testadmin@example.com';
   ```
3. Must be: `role = 'admin'` AND `status = 'active'`

## 📝 Next Steps After Verification

Once all tests pass:

1. **Update your production environment** (when ready):
   - Run the same migration on production database
   - Update any existing production users' roles
   - Deploy the updated code

2. **Update existing users:**
   - Assign admin roles to appropriate users
   - Review and set correct directory access permissions

3. **Clean up test accounts** (optional):
   ```sql
   DELETE FROM app_users WHERE email LIKE 'test%@example.com';
   ```

## 📚 Documentation Reference

- **ROLE_BASED_ACCESS_CONTROL.md** - Complete technical documentation
- **ADMIN_ROLE_IMPLEMENTATION_COMPLETE.md** - Implementation summary
- **USER_MANAGEMENT_IMPLEMENTATION.md** - Original user management docs

## 🎊 Congratulations!

Your role-based access control system is now fully functional! You can manage admins and regular users with fine-grained access control.

**Key Features Now Available:**
- ✅ Create admin users with full system access
- ✅ Create regular users with directory-only access
- ✅ Control directory access per user
- ✅ Visual role indicators (badges)
- ✅ Proper access control at all levels
- ✅ Backward compatible with existing ADMIN_EMAILS

Enjoy your new role-based user management system! 🚀
