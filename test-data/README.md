# Mock Test Data for Admin Panel Testing

This directory contains comprehensive mock data for testing all admin panel features with **real existing alumni profiles**.

## 📋 Overview

Generated mock data for the **first 5 real alumni profiles**:
1. **A Arjoon** (ID: 1) - CTO at TCS, Chennai
2. **Annamalai Natarajan** (ID: 2) - VP Product Engineering at Infosys, Bangalore
3. **A S Syed Ahamed Khan** (ID: 3) - Senior Director Cloud at Microsoft, Mumbai
4. **Antony G Prakash** (ID: 4) - Director of Engineering at Zoho, Chennai
5. **Abishek Valluru** (ID: 5) - Founder & CEO at DataMatrix, Hyderabad

## 📂 Folder Structure

```
test-data/
├── 📄 mock_bulk_update.csv       - Profile data for testing
├── 📄 mock_qa_answers.csv        - Q&A answers for testing
├── 📦 mock_images.zip            - ZIP for bulk image upload
├── 📁 profile-images/            - Individual images (1.jpg-5.jpg)
├── 🔧 generate-images.js         - Utility to regenerate images
├── 🔧 create-zip.js              - Utility to regenerate ZIP
├── 📑 README.md                  - This documentation
└── 📁 archived/                  - Old/reference data
    ├── bulk_update_profiles.csv
    └── test_qa_answers.csv
```

## 📁 Files Generated

### 1. `mock_bulk_update.csv` (4.4 KB)
**Purpose:** Test Bulk Profile Update feature
**Admin Panel Tab:** "Bulk Update" → Upload CSV section
**Contents:**
- All 5 profiles with comprehensive professional data
- Fields: id, name, email, phone, location, year_graduated, current_job, company, bio, linkedin_url, nicknames
- Realistic Indian professional backgrounds (23+ years experience, Class of 2000)
- Valid Indian phone numbers (+91 format)
- Professional email addresses
- LinkedIn URLs
- Detailed 150-200 word bios

**How to use:**
1. Go to Admin Panel → "Bulk Update" tab
2. Click "Upload Updated CSV"
3. Select `mock_bulk_update.csv`
4. Submit to update all 5 profiles at once

---

### 2. `mock_images.zip` (27 KB)
**Purpose:** Test Bulk Image Upload feature
**Admin Panel Tab:** "Bulk Update" → Bulk Image Upload section
**Contents:**
- 5 profile images: `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`, `5.jpg`
- Each image named by profile ID for automatic mapping
- Generated using UI Avatars API with distinct colors
- Format: 400x400 PNG exported as JPG

**How to use:**
1. Go to Admin Panel → "Bulk Update" tab
2. Scroll to "📸 Bulk Image Upload" section
3. Upload `mock_images.zip`
4. Preview mappings in the modal
5. Confirm to apply images to all 5 profiles

---

### 3. `mock_qa_answers.csv` (14 KB)
**Purpose:** Test Q&A Upload feature
**Admin Panel Tab:** "Q&A Upload"
**Contents:**
- 50 Q&A entries (10 questions × 5 profiles)
- All 10 standard questions answered for each profile
- Culturally appropriate Indian school experiences
- Answers reflect their professional backgrounds and locations
- Realistic responses (100-250 words each)

**Questions covered:**
1. A school memory that still makes you smile
2. Your favourite spot in school
3. If you get one full day in school today, what would you do...
4. Advice for younger students entering workforce
5. A book/movie/experience that changed your perspective
6. A personal achievement that means a lot to you
7. Your favourite hobby when off work
8. Your favourite go-to song(s) to enliven spirits
9. What reconnecting with alumni group means to you
10. Open to mentoring/collaborating with alumni

**How to use:**
1. Go to Admin Panel → "Q&A Upload" tab
2. Upload `mock_qa_answers.csv`
3. View populated Q&A by going to "Manage Profiles" → Edit any profile

---

### 4. `profile-images/` Directory
**Purpose:** Individual image files for manual testing
**Contents:**
- `1.jpg` - A Arjoon (Blue avatar)
- `2.jpg` - Annamalai Natarajan (Red avatar)
- `3.jpg` - A S Syed Ahamed Khan (Green avatar)
- `4.jpg` - Antony G Prakash (Orange avatar)
- `5.jpg` - Abishek Valluru (Purple avatar)

**How to use:**
- Use these for testing single profile image upload
- Test edit profile modal image change
- Verify image preview functionality

---

## 🧪 Complete Testing Workflow

### Step 1: Bulk Update Profiles
1. Navigate to `/admin-panel`
2. Go to "Bulk Update" tab
3. Upload `mock_bulk_update.csv`
4. Verify 5 profiles updated successfully

### Step 2: Bulk Upload Images
1. In same "Bulk Update" tab
2. Scroll to "📸 Bulk Image Upload"
3. Upload `mock_images.zip`
4. Review preview modal showing all 5 mappings
5. Confirm and apply

### Step 3: Upload Q&A Answers
1. Go to "Q&A Upload" tab
2. Upload `mock_qa_answers.csv`
3. Verify 50 answers uploaded successfully

### Step 4: Verify Data
1. Go to "Manage Profiles" tab
2. Click "Edit" on any of the first 5 profiles
3. Verify:
   - ✅ Profile details updated
   - ✅ Profile image displayed
   - ✅ All 10 Q&A answers populated
4. Test editing and saving changes

---

## 📊 Data Statistics

| Metric | Count/Details |
|--------|---------------|
| **Profiles** | 5 real alumni (IDs 1-5) |
| **Profile Fields** | 11 fields populated per profile |
| **Images** | 5 professional avatars |
| **Q&A Entries** | 50 (10 questions × 5 profiles) |
| **Total File Size** | ~48 KB |
| **Data Quality** | Realistic Indian professional context |

---

## 🎯 Features Tested

- ✅ Bulk profile update via CSV
- ✅ Bulk image upload via ZIP with preview
- ✅ Q&A answers upload via CSV
- ✅ Profile editing modal
- ✅ Image upload and preview
- ✅ Profile search and filtering
- ✅ Pagination
- ✅ Data validation
- ✅ Success/error messaging

---

## 🗑️ Cleanup & Reset

If you need to reset test data:

1. **Bulk Delete Q&A Answers:**
   ```sql
   DELETE FROM profile_answers WHERE profile_id IN (1,2,3,4,5);
   ```

2. **Reset Profile Data:**
   - Original test data is preserved in `archived/` folder
   - Use `archived/bulk_update_profiles.csv` to restore original test profiles
   - Use `archived/test_qa_answers.csv` to restore original Q&A data

3. **Remove Images:**
   - Delete images from Supabase Storage
   - Or re-upload originals from `profile-images/` folder

4. **Archived Folder:**
   - Contains old reference data with international test names
   - `bulk_update_profiles.csv` - Original profiles (Rajesh Kumar, Emily Chen, etc.)
   - `test_qa_answers.csv` - Original Q&A answers
   - Preserved for reference, not actively used in testing

---

## 📝 Notes

- All mock data uses **real alumni names and IDs** from your database
- Professional backgrounds are fictional but realistic for Class of 2000
- Q&A answers reference Indian school culture and experiences
- Phone numbers are in valid Indian format but fictional
- Email addresses are mock but follow professional naming conventions
- LinkedIn URLs are formatted realistically but may not exist

---

## 🔧 Utility Scripts

### `generate-images.js`
Node.js script that downloads placeholder avatars from UI Avatars API.

**Run:**
```bash
node generate-images.js
```

### `create-zip.js`
Node.js script that creates the ZIP file from profile-images directory.

**Run:**
```bash
node create-zip.js
```

---

## ✅ Validation Checklist

Use this checklist when testing:

- [ ] Can upload bulk profile update CSV
- [ ] All 5 profiles show updated information
- [ ] Can upload ZIP file with images
- [ ] Preview modal shows correct mappings
- [ ] Images apply successfully to profiles
- [ ] Can upload Q&A answers CSV
- [ ] All 50 answers inserted correctly
- [ ] Can view Q&A in profile edit modal
- [ ] Can edit and update individual profiles
- [ ] Can change profile images in edit modal
- [ ] Search and filter work correctly
- [ ] Pagination displays properly
- [ ] Success messages appear for all operations
- [ ] Error handling works for invalid data

---

**Generated:** November 5, 2025
**Last Updated:** November 5, 2025 (Cleanup completed)
**Profile Count:** 5 real alumni (IDs 1-5)
**Total Test Entries:** 55 (5 profiles + 50 Q&A answers)
**Data Set:** Mock data with real Indian alumni names and professional context
**Archived Data:** Old reference data preserved in `archived/` folder
