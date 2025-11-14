# 🧪 Test the Bug Reporter SDK - Quick Guide

## ✅ Configuration Status

**Environment Variables**: ✅ CORRECT
```env
NEXT_PUBLIC_BUG_REPORTER_API_URL=https://jkkn-centralized-bug-reporter.vercel.app
                                                                                  ^
                                                                      BASE URL ONLY ✅
```

**Dev Server**: ✅ RUNNING
```
Port: 3004
Status: Ready
Environment: .env.local loaded
Errors: None
```

**Files**: ✅ CONFIGURED
- `components/BugReporterWrapper.tsx` - SDK wrapper with validation
- `app/layout.tsx` - Wrapping app with BugReporterWrapper
- `.env.local` - Base URL configured correctly

---

## 🎯 How to Test (30 Seconds)

### 1. Open Browser
```
http://localhost:3004
```

### 2. Open DevTools Console (F12)

**Look for this message**:
```
✅ Bug Reporter SDK: ENABLED
   Platform URL: https://jkkn-centralized-bug-reporter.vercel.app
```

**If you see this instead, there's still an issue**:
```
⚠️ Bug Reporter: URL should be BASE URL only!
```

### 3. Look for Floating Button

**Bottom-right corner of the screen:**
- 🐛 Bug icon
- Purple/pink gradient
- Floating button

### 4. Click and Test

1. Click the bug button
2. Fill in:
   - Title: "SDK test after fix"
   - Description: "Testing base URL configuration"
3. Click "Submit Bug Report"
4. Should see: ✅ Success message

---

## 🔍 What to Check in Console

### ✅ Success Indicators:
```
✅ Bug Reporter SDK: ENABLED
   Platform URL: https://jkkn-centralized-bug-reporter.vercel.app
```

### ❌ Failure Indicators:
```
❌ 405 Method Not Allowed
❌ chrome-extension://invalid/i1
❌ Failed to execute 'json' on 'Response'
❌ Bug Reporter: URL should be BASE URL only!
```

### Network Tab During Submission:

**Expected Request**:
```
POST https://jkkn-centralized-bug-reporter.vercel.app/api/v1/public/bug-reports
Status: 200 OK
Response: { "success": true, "data": { ... } }
```

**NOT This (Wrong)**:
```
POST https://.../api/v1/public/api/v1/public/bug-reports
                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    DOUBLE PATH - 405 ERROR
Status: 405 Method Not Allowed
```

---

## 🐛 If SDK is NOT Working

### Check 1: Environment Variable
```bash
grep "NEXT_PUBLIC_BUG_REPORTER_API_URL" .env.local
```

**Should show**:
```
NEXT_PUBLIC_BUG_REPORTER_API_URL=https://jkkn-centralized-bug-reporter.vercel.app
```

**Should NOT include `/api/v1/public` at the end!**

### Check 2: Dev Server Port
- Make sure you're on **port 3004**
- Old ports (3000, 3001, 3002, 3003) may have old config cached

### Check 3: Browser Console
- Open DevTools (F12)
- Check Console tab for SDK initialization message
- Check Network tab for API requests during submission

### Check 4: Hard Refresh
- Press `Ctrl + Shift + R` to clear browser cache
- Check if floating button appears after refresh

---

## 📊 Before vs After

### Before (Broken):
```
.env.local:
NEXT_PUBLIC_BUG_REPORTER_API_URL=...vercel.app/api/v1/public
                                                ^^^^^^^^^^^^^^^^ WRONG!

Console:
❌ 405 Method Not Allowed
❌ chrome-extension errors
❌ JSON parsing errors

Result:
❌ SDK not working
```

### After (Fixed):
```
.env.local:
NEXT_PUBLIC_BUG_REPORTER_API_URL=...vercel.app
                                                ^ BASE URL ONLY ✅

Console:
✅ Bug Reporter SDK: ENABLED

Result:
✅ SDK working perfectly
```

---

## 🎯 Quick Verification

1. **Server Running**: ✅ Port 3004
2. **URL Correct**: ✅ Base URL only (no /api/v1/public)
3. **SDK Loaded**: Check console for "ENABLED" message
4. **Widget Visible**: Look for floating bug button
5. **Submission Works**: Test submitting a bug

---

## 🚀 READY TO TEST!

Open http://localhost:3004 and check the browser console!

The SDK should now work correctly with the proper base URL configuration.
