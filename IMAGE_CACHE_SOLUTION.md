# Image Caching Issue - SOLVED ✅

## The Problem
When you delete or update an image in Supabase Storage and upload a new one with the **same filename**, the website still shows the old image even after refreshing. This happens because:

1. **Browser Cache**: Your browser caches images locally
2. **CDN Cache**: Supabase CDN caches images for performance
3. **Same URL**: If filename is the same, the URL doesn't change, so cache isn't cleared

## Example:
```
1. Upload: profile-images/alumni/39-david-a.png
2. Delete it
3. Upload new: profile-images/alumni/39-david-a.png (same name)
4. URL stays: https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/39-david-a.png
5. Browser thinks: "I already have this URL cached!" ❌
```

---

## ✅ Solutions Implemented

### Solution 1: Cache-Busting Query Parameters (ACTIVE)
We add a timestamp parameter to force browsers to load fresh images.

**How it works:**
```typescript
// Before
<img src="https://...supabase.co/.../profile.png" />

// After (with cache buster)
<img src="https://...supabase.co/.../profile.png?t=1730709600000" />
```

When the timestamp changes, browser sees it as a new URL and fetches fresh image!

**Implementation:**
- Created utility: `lib/utils/image-cache-buster.ts`
- Updated: `app/directory/page.tsx` (directory listing)
- Updated: `components/ProfileCard.tsx` (profile cards)

**Usage:**
```typescript
import { addCacheBuster } from '@/lib/utils/image-cache-buster';

// Use with database timestamp (recommended)
<img src={addCacheBuster(profile.profile_image_url, profile.updated_at)} />

// Or force fresh load
import { forceRefreshImage } from '@/lib/utils/image-cache-buster';
<img src={forceRefreshImage(profile.profile_image_url)} />
```

---

## 🎯 How to Update Images in Supabase (Best Practice)

### Method 1: Update via Supabase Storage Dashboard
1. Go to **Storage** → `profile-images` bucket
2. **Delete** the old image
3. **Upload** new image with same name
4. In **Table Editor** → `profiles` table → Find the row
5. **Update** the `updated_at` field to current timestamp (or click Edit and Save)
6. Refresh your website → New image appears! ✅

### Method 2: Use Different Filenames (Alternative)
```
❌ Bad:  39-david-a.png → delete → 39-david-a.png (same name = cached)
✅ Good: 39-david-a.png → delete → 39-david-a-v2.png (different name = fresh)
```

Then update the database:
```sql
UPDATE profiles
SET profile_image_url = 'https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/39-david-a-v2.png',
    updated_at = NOW()
WHERE id = 39;
```

### Method 3: SQL Script to Bulk Refresh Images
If you uploaded many new images, update all timestamps:

```sql
-- Force cache refresh for all profiles
UPDATE profiles
SET updated_at = NOW();

-- Or specific profiles
UPDATE profiles
SET updated_at = NOW()
WHERE name IN ('David A', 'David Jacob', 'Debin Davis');
```

---

## 🧪 Testing the Fix

### Test 1: Check if it works
1. Open website: `http://localhost:3000/directory`
2. Open browser DevTools (F12) → Network tab
3. Look at image URLs - they should have `?t=1730709600000` parameter
4. Update image in Supabase → Update `updated_at` field
5. Refresh website → New image should appear!

### Test 2: Manual cache clearing (if needed)
- **Chrome**: Ctrl + Shift + R (hard refresh)
- **Firefox**: Ctrl + F5
- **Clear all cache**: Browser Settings → Clear browsing data → Cached images

### Test 3: Use the test file
Open: `test-image-loading.html` in browser to verify images load correctly

---

## 📝 Additional Notes

### When to Update `updated_at` Field
**Always** update it when you:
- Upload a new profile image
- Delete and re-upload with same filename
- Change any profile data

### Automatic Timestamp Updates
You can add a Supabase trigger to auto-update `updated_at`:

```sql
-- Create trigger to auto-update updated_at
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

### Performance Impact
Adding `?t=timestamp` has **zero performance impact**:
- Supabase CDN ignores query parameters for caching
- Only affects client-side browser cache
- Images are still cached on CDN for fast delivery

---

## 🚨 Troubleshooting

### Issue: Still seeing old images
1. Check if `updated_at` field was actually updated in database
2. Clear browser cache (Ctrl + Shift + R)
3. Check if image URL has `?t=` parameter in DevTools → Network tab
4. Verify new image was actually uploaded to Storage

### Issue: Images not loading at all
1. Check Storage bucket is **public**
2. Verify Storage policies allow public read
3. Test URL directly in browser
4. Check console for CORS errors

### Issue: Placeholder images showing
1. Check `profile_image_url` field is not null in database
2. Verify Storage URL format is correct
3. Check file actually exists in Storage bucket

---

## 📚 Files Modified
- ✅ `lib/utils/image-cache-buster.ts` (NEW utility)
- ✅ `app/directory/page.tsx` (directory listing)
- ✅ `components/ProfileCard.tsx` (profile cards)
- ✅ `IMAGE_CACHE_SOLUTION.md` (this file)

## Next Steps
Apply the same cache-busting to other pages that show profile images:
- Individual profile pages (`/directory/[slug]`)
- Gallery pages
- Any other image displays

---

**Solution Status: ✅ IMPLEMENTED**

Now when you update images in Supabase Storage and update the `updated_at` field, the website will immediately show the new image!
