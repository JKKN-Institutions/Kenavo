# 🖼️ Quick Guide: Update Profile Images

## Problem You Were Having
- Deleted image in Supabase Storage
- Uploaded new image
- Website still shows **OLD image** even after refresh ❌

## Root Cause
Browser and CDN cache old images when filename stays the same.

---

## ✅ SOLUTION (2 Simple Steps)

### Step 1: Update Image in Supabase Storage
1. Open **Supabase Dashboard** → **Storage** → `profile-images` bucket
2. Delete old image
3. Upload new image (can use same filename now!)

### Step 2: Update the `updated_at` Timestamp
Go to **Table Editor** → `profiles` table

**Option A - Manual Update (Quick):**
1. Find the profile row
2. Click **Edit** (pencil icon)
3. The `updated_at` field will auto-update to current time
4. Click **Save**

**Option B - SQL Update (Bulk):**
```sql
-- Update single profile
UPDATE profiles
SET updated_at = NOW()
WHERE id = 39;

-- Update multiple profiles at once
UPDATE profiles
SET updated_at = NOW()
WHERE name IN ('David A', 'John Doe', 'Jane Smith');

-- Update ALL profiles (if you changed many images)
UPDATE profiles
SET updated_at = NOW();
```

### Step 3: Refresh Website
- Open your website
- Press **Ctrl + Shift + R** (hard refresh)
- New image should appear! ✅

---

## 🎯 How It Works Now

Before (Old URL - Cached):
```
https://...supabase.co/.../39-david-a.png
```

After (New URL with timestamp - Fresh):
```
https://...supabase.co/.../39-david-a.png?t=1730709600000
                                          ↑ This changes when updated_at changes
```

Browser sees different URL → Loads fresh image!

---

## 🔧 Alternative Method: Use Different Filenames

Instead of updating timestamps, use unique filenames:

```
❌ OLD WAY:
- Delete: 39-david-a.png
- Upload: 39-david-a.png (same name = cached)

✅ NEW WAY:
- Delete: 39-david-a.png
- Upload: 39-david-a-new.png (different name = fresh!)
```

Then update database:
```sql
UPDATE profiles
SET profile_image_url = 'https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/39-david-a-new.png'
WHERE id = 39;
```

---

## 🚀 Pro Tips

### Tip 1: Batch Update After Multiple Uploads
If you uploaded 10 new images at once:
```sql
UPDATE profiles
SET updated_at = NOW()
WHERE id IN (39, 40, 41, 42, 43, 44, 45, 46, 47, 48);
```

### Tip 2: Automatic Timestamp Updates
Add this trigger to auto-update `updated_at` on any profile change:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

After adding this trigger, you only need to edit the profile (any field) and `updated_at` updates automatically!

### Tip 3: Clear Browser Cache
If still seeing old images:
- **Chrome/Edge**: Ctrl + Shift + Del → Clear cached images
- **Firefox**: Ctrl + Shift + Del → Clear cache
- **Hard Refresh**: Ctrl + Shift + R

---

## 📋 Checklist for Updating Images

- [ ] Upload new image to Supabase Storage
- [ ] Update `updated_at` field in `profiles` table
- [ ] Hard refresh website (Ctrl + Shift + R)
- [ ] Verify new image appears

---

## 🆘 Still Not Working?

1. **Check the `updated_at` field** - Did it actually change?
   ```sql
   SELECT id, name, updated_at FROM profiles WHERE id = 39;
   ```

2. **Check image URL in browser DevTools**:
   - Press F12 → Network tab
   - Look for image request
   - Should see `?t=1730709600000` in URL

3. **Verify image uploaded correctly**:
   - Go to Storage → profile-images
   - Find the file and click to preview
   - Is it the correct new image?

4. **Test URL directly**:
   Copy image URL from database and paste in browser
   Add `?t=12345` to force fresh load

---

## 📞 Need Help?

Check these files for technical details:
- `IMAGE_CACHE_SOLUTION.md` - Full technical documentation
- `lib/utils/image-cache-buster.ts` - Cache busting utility code
- `test-image-loading.html` - Test if images load correctly

---

**That's it! Now you can update profile images anytime without caching issues! 🎉**
