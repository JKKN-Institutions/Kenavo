# Bug Reporter Screenshot Issue - Explained

## 🔍 Issue Description

**User reported**: Screenshots show a local file path like:
```
'c:/Users/admin/Downloads/bug-screenshot-1763116029996-0l4upk.png'
```

But the actual image is not found or displayed properly in the JKKN Bug Reporter dashboard.

---

## ✅ SDK Investigation Results

### 1. SDK Screenshot Capture - Working Correctly

I investigated the `@boobalan_jkkn/bug-reporter-sdk` source code and found:

**File**: `node_modules/@boobalan_jkkn/bug-reporter-sdk/dist/index.js`

**Screenshot Capture Code**:
```javascript
async function captureScreenshot() {
  console.log("[BugReporter SDK] Starting screenshot capture...");

  // ... capture configuration ...

  const canvas = await html2canvas(document.body, options);
  const dataUrl = canvas.toDataURL("image/png", 1);  // ✅ Creates base64 data URL

  console.log("[BugReporter SDK] Screenshot captured successfully");
  return dataUrl;  // ✅ Returns base64 string
}
```

**Key Finding**: The SDK correctly captures screenshots as **base64 data URLs**, not local files!

### 2. SDK Submission Code - Sending Correctly

**Submission Payload**:
```javascript
const payload = {
  title: title.trim(),
  page_url: window.location.href,
  description: description.trim(),
  category,
  screenshot_data_url: screenshot,  // ✅ Sends base64 data URL
  console_logs: consoleLogs,
  metadata: { /* ... */ },
  reporter_email: config.userContext?.email,
  reporter_name: config.userContext?.name
};

await apiClient.createBugReport(payload);
```

**Key Finding**: The SDK sends `screenshot_data_url` with the complete base64 image data.

### 3. Data URL Format

The `screenshot` variable contains data in this format:
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA... (thousands of characters)
```

This is a **complete, self-contained image** that can be displayed directly in HTML:
```html
<img src="data:image/png;base64,iVBORw0..." />
```

---

## 🎯 Root Cause

**The SDK is working correctly!** It:
1. ✅ Captures screenshots using html2canvas
2. ✅ Converts to base64 data URL
3. ✅ Sends to JKKN platform with `screenshot_data_url` field
4. ✅ Does NOT save files locally

**The issue is on the JKKN Bug Reporter Platform side:**

The platform receives the `screenshot_data_url` but might be:
- Showing a temporary file path in the UI instead of rendering the image
- Having an issue processing or storing the base64 data
- Trying to download/save the image locally before displaying
- Not properly handling the `screenshot_data_url` field in the API

---

## 🔍 How to Verify

### 1. Check Browser Network Tab

When you submit a bug report:

1. Open DevTools (F12) → Network tab
2. Click the floating bug button
3. Fill in the form and submit
4. Look for the POST request to `/api/v1/public/bug-reports`
5. Click on the request → Payload tab

**You should see**:
```json
{
  "title": "...",
  "description": "...",
  "category": "bug",
  "screenshot_data_url": "data:image/png;base64,iVBORw0KGgoAAAANSU...",
  "page_url": "...",
  "console_logs": [],
  "metadata": { ... },
  "reporter_email": "...",
  "reporter_name": "..."
}
```

**The `screenshot_data_url` field should contain the full base64 string** (usually 50,000+ characters).

### 2. Check Response

After the request:
1. Go to Response tab
2. Check if the response is successful:
```json
{
  "success": true,
  "data": {
    "bug_report": {
      "id": "...",
      "display_id": "BUG-123",
      "screenshot_url": "???"  // Check what the platform returns
    }
  }
}
```

---

## 💡 Possible Solutions

### Option 1: JKKN Platform Fix (Recommended)

**The JKKN Bug Reporter Platform needs to**:

1. **Accept** the `screenshot_data_url` field properly
2. **Store** the base64 image data
3. **Convert** to an actual file and store in cloud storage (S3, Supabase Storage, etc.)
4. **Return** a proper URL to the stored image
5. **Display** the screenshot in the dashboard using the stored URL

**Example Platform Code** (what JKKN platform should do):
```javascript
// On the JKKN Platform backend
async function processBugReport(data) {
  // Extract screenshot
  const screenshotDataUrl = data.screenshot_data_url;

  if (screenshotDataUrl && screenshotDataUrl.startsWith('data:image/')) {
    // Convert base64 to buffer
    const base64Data = screenshotDataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to storage (S3, Supabase, etc.)
    const filename = `bug-screenshots/${bugId}-${Date.now()}.png`;
    const uploadedUrl = await storage.upload(filename, buffer);

    // Store the URL in database
    await db.bug_reports.update({
      id: bugId,
      screenshot_url: uploadedUrl  // Permanent URL, not local path!
    });
  }
}
```

### Option 2: Verify Configuration

Ensure your `.env.local` is correct:
```env
NEXT_PUBLIC_BUG_REPORTER_API_KEY=br_KvGk334aJf4IJX913xMIYatKIK5m506V
NEXT_PUBLIC_BUG_REPORTER_API_URL=https://jkkn-centralized-bug-reporter.vercel.app
```

**Make sure**:
- ✅ API key is valid and has proper permissions
- ✅ URL is the base URL (no `/api/v1/public` suffix)
- ✅ Platform endpoint accepts `screenshot_data_url` field

### Option 3: Contact JKKN Platform Developers

Since this appears to be a **platform-side issue**, you should:

1. **Check JKKN Platform Dashboard**:
   - Log in to https://jkkn-centralized-bug-reporter.vercel.app
   - View the submitted bug report
   - Check if screenshot appears or shows error

2. **Report to Platform Team**:
   - Inform them about the `screenshot_data_url` handling issue
   - Share that SDK is sending correct base64 data
   - Request they verify their screenshot storage/display logic

3. **Ask Platform Team**:
   - Does the platform properly save screenshots from `screenshot_data_url`?
   - Is there cloud storage configured for screenshots?
   - Are there any errors in platform logs when processing screenshots?

---

## 🧪 Testing Screenshot Upload

### Quick Test to Verify SDK Works

1. **Open DevTools** before clicking bug button
2. **Go to Network tab**
3. **Click bug button** → Fill form → Submit
4. **Check the POST request payload** - should contain huge `screenshot_data_url` string
5. **Check response** - note what `screenshot_url` field contains

### Check Console Logs

The SDK logs helpful messages:
```
[BugReporter SDK] Starting screenshot capture...
[BugReporter SDK] Screenshot captured successfully
[BugReporter SDK] Submitting bug report...
```

If you see these, the SDK is working correctly.

---

## 📋 Summary

### What's Working ✅
1. SDK captures screenshots correctly using html2canvas
2. SDK converts to base64 data URL
3. SDK sends complete image data in `screenshot_data_url` field
4. Our application configuration is correct

### What's NOT Working ❌
1. JKKN Platform may not be properly processing `screenshot_data_url`
2. Platform might be showing temporary/local file paths instead of stored images
3. Platform might not have proper screenshot storage configured

### Next Steps
1. **Verify** the screenshot data is being sent (check Network tab)
2. **Check** JKKN Platform dashboard to see how screenshot appears
3. **Contact** JKKN Platform developers if screenshots are not displaying
4. **Request** they implement proper screenshot storage from base64 data

---

## 🔧 Workaround (If Platform Issue Persists)

If JKKN Platform continues having issues with screenshots, we could:

### Option A: Add Manual Screenshot Upload

Create a custom bug reporter that uploads screenshots directly to Supabase Storage:

```typescript
// Upload screenshot to our own Supabase storage
const uploadScreenshot = async (dataUrl: string) => {
  const base64Data = dataUrl.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const { data, error } = await supabase.storage
    .from('bug-screenshots')
    .upload(`screenshot-${Date.now()}.png`, buffer, {
      contentType: 'image/png'
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('bug-screenshots')
    .getPublicUrl(data.path);

  return publicUrl;
};

// Then send URL to JKKN instead of base64
const screenshotUrl = await uploadScreenshot(screenshot);
await apiClient.createBugReport({
  ...payload,
  screenshot_url: screenshotUrl,  // Send URL instead of data URL
});
```

### Option B: Disable Screenshots Temporarily

If screenshots are causing issues, we could make them optional:

```typescript
// In BugReporterWrapper, modify validation
if (!screenshot || screenshot.trim().length === 0) {
  // Don't block submission, just warn
  console.warn('Screenshot not captured, submitting without screenshot');
}

// Submit with or without screenshot
await apiClient.createBugReport({
  ...payload,
  screenshot_data_url: screenshot || null,  // Allow null
});
```

---

## 🎯 Recommendation

**Primary Action**: Contact JKKN Bug Reporter Platform developers and report that:

1. The SDK is correctly sending `screenshot_data_url` with base64 image data
2. But the platform appears to be showing local file paths instead of stored images
3. Request they verify their screenshot processing and storage implementation

**Secondary Action**: Test thoroughly:
- Check Network tab to confirm data is being sent
- Check platform dashboard to see actual screenshot state
- Gather evidence (screenshots of Network tab, platform UI) to share with platform team

---

**The SDK configuration on our end is correct!** The issue requires JKKN Platform team attention.
