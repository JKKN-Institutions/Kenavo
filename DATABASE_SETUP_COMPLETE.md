# Database Setup Complete ✅

## Overview

Complete database structure created for Kenavo Alumni Directory using Supabase MCP.

**Migration Applied**: `enhance_profiles_and_gallery_structure`
**Timestamp**: 2025-10-29
**Status**: ✅ All systems operational

---

## 📊 Database Tables

### 1. `profiles` Table

**Purpose**: Store alumni profile information

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | INTEGER | PRIMARY KEY | Manual (1-134) |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | - |
| `profile_image_url` | TEXT | NULLABLE | - |
| `location` | VARCHAR(255) | NULLABLE | - |
| `year_graduated` | VARCHAR(4) | NULLABLE | '2000' |
| `current_job` | VARCHAR(255) | NULLABLE | - |
| `company` | VARCHAR(255) | NULLABLE | - |
| `bio` | TEXT | NULLABLE | - |
| `email` | VARCHAR(255) | NULLABLE | - |
| `phone` | VARCHAR(50) | NULLABLE | - |
| `linkedin_url` | TEXT | NULLABLE | - |
| `created_at` | TIMESTAMPTZ | NOT NULL | TIMEZONE('utc', NOW()) |
| `updated_at` | TIMESTAMPTZ | NOT NULL | TIMEZONE('utc', NOW()) |

**Features**:
- ✅ Unique constraint on `name`
- ✅ Manual ID assignment (no auto-increment)
- ✅ Automatic `updated_at` timestamp via trigger
- ✅ UTC timezone enforcement

---

### 2. `gallery_images` Table

**Purpose**: Store gallery images for each alumni profile

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment |
| `profile_id` | INTEGER | FOREIGN KEY → profiles(id) ON DELETE CASCADE | - |
| `image_url` | TEXT | NOT NULL | - |
| `caption` | TEXT | NULLABLE | - |
| `image_type` | VARCHAR(50) | NULLABLE | 'gallery' |
| `order_index` | INTEGER | NULLABLE | 0 |
| `created_at` | TIMESTAMPTZ | NOT NULL | TIMEZONE('utc', NOW()) |

**Features**:
- ✅ Foreign key relationship with profiles
- ✅ Cascade delete (deleting profile deletes images)
- ✅ Supports ordering via `order_index`
- ✅ Image type classification

---

## 🔍 Database Indexes

Performance optimized with the following indexes:

1. `idx_profiles_name` - Index on profiles(name)
2. `idx_profiles_year` - Index on profiles(year_graduated)
3. `idx_gallery_profile` - Index on gallery_images(profile_id)

**Benefits**:
- Fast name searches
- Quick filtering by graduation year
- Efficient gallery image lookups

---

## 🔒 Row Level Security (RLS)

### Status
- ✅ `profiles` table: RLS ENABLED
- ✅ `gallery_images` table: RLS ENABLED

### Policies

#### Profiles Table

| Policy Name | Operation | Role | Rule |
|-------------|-----------|------|------|
| Public profiles are viewable by everyone | SELECT | public | Always allow |
| Authenticated users can insert profiles | INSERT | authenticated | Always allow |
| Authenticated users can update profiles | UPDATE | authenticated | Always allow |

#### Gallery Images Table

| Policy Name | Operation | Role | Rule |
|-------------|-----------|------|------|
| Public gallery images are viewable by everyone | SELECT | public | Always allow |
| Authenticated users can insert gallery images | INSERT | authenticated | Always allow |
| Authenticated users can update gallery images | UPDATE | authenticated | Always allow |
| Authenticated users can delete gallery images | DELETE | authenticated | Always allow |

**Security Model**:
- 🌐 **Public Read**: Anyone can view profiles and images
- 🔐 **Authenticated Write**: Only authenticated users can create/update/delete

---

## 📦 Storage Buckets

### 1. `profile-images` Bucket

```json
{
  "name": "profile-images",
  "public": true,
  "file_size_limit": 5242880,  // 5 MB
  "allowed_mime_types": [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ]
}
```

**Purpose**: Alumni profile photos
**Structure**: `alumni/{id}-{safe-name}.{ext}`
**Example**: `alumni/1-a-arjoon.png`

---

### 2. `gallery-images` Bucket

```json
{
  "name": "gallery-images",
  "public": true,
  "file_size_limit": 5242880,  // 5 MB
  "allowed_mime_types": [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ]
}
```

**Purpose**: Gallery/event photos
**Structure**: `{profile-id}/{filename}.{ext}`
**Example**: `42/event-photo-1.jpg`

---

## ⚙️ Database Functions & Triggers

### Function: `update_updated_at_column()`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql'
SET search_path = ''
SECURITY DEFINER;
```

**Features**:
- ✅ Automatically updates `updated_at` timestamp
- ✅ Secure with `search_path = ''`
- ✅ SECURITY DEFINER for proper execution

### Trigger: `update_profiles_updated_at`

```sql
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Behavior**: Automatically sets `updated_at` to current UTC time on any profile update

---

## 🔐 Security Audit

### Security Advisors Check: ✅ PASSED

All security recommendations have been implemented:
- ✅ Function search_path is set
- ✅ RLS enabled on all tables
- ✅ Public policies properly configured
- ✅ SECURITY DEFINER properly used

---

## 📊 Current Database State

### Tables
- ✅ `profiles`: 0 rows (ready for import)
- ✅ `gallery_images`: 0 rows

### Storage
- ✅ `profile-images`: Empty (ready for upload)
- ✅ `gallery-images`: Empty (ready for upload)

---

## 🚀 Next Steps

### 1. Import Alumni Data

```bash
# Validate data first
npm run validate:alumni

# Import all 134 profiles
npm run import:alumni
```

This will:
- Upload 134 profile images to `profile-images/alumni/`
- Create 134 records in `profiles` table
- Generate public URLs for all images

### 2. Verify Import

```sql
-- Check total profiles
SELECT COUNT(*) FROM profiles;
-- Expected: 134

-- View sample profile
SELECT id, name, location, profile_image_url
FROM profiles
LIMIT 5;

-- Check images uploaded
-- Go to Storage > profile-images > alumni/
-- Should see 134 renamed images
```

### 3. Test Public Access

```bash
# Get a profile image URL from database
# Paste in browser - should display image
```

---

## 📝 Usage Examples

### Insert a Profile

```sql
INSERT INTO profiles (
  id, name, location, year_graduated, bio
) VALUES (
  1,
  'A Arjoon',
  'Chennai, Tamil Nadu',
  '2000',
  'Alumni from the Class of 2000. Currently based in Chennai.'
);
```

### Add Gallery Images

```sql
INSERT INTO gallery_images (
  profile_id, image_url, caption, order_index
) VALUES (
  1,
  'https://your-project.supabase.co/storage/v1/object/public/gallery-images/1/event-1.jpg',
  'Class reunion 2020',
  1
);
```

### Query Profiles with Gallery

```sql
SELECT
  p.id,
  p.name,
  p.profile_image_url,
  COUNT(g.id) as gallery_count
FROM profiles p
LEFT JOIN gallery_images g ON p.id = g.profile_id
GROUP BY p.id, p.name, p.profile_image_url
ORDER BY p.name;
```

---

## 🔧 Maintenance

### Update a Profile

```sql
UPDATE profiles
SET
  current_job = 'Senior Developer',
  company = 'Tech Corp',
  linkedin_url = 'https://linkedin.com/in/username'
WHERE id = 1;
-- updated_at will be automatically set to current time
```

### Delete a Profile (and cascade gallery images)

```sql
DELETE FROM profiles WHERE id = 1;
-- This will also delete all gallery_images for this profile
```

---

## 📋 Database Schema Diagram

```
┌─────────────────────────┐
│       profiles          │
├─────────────────────────┤
│ id (PK)                 │
│ name (UNIQUE)           │
│ profile_image_url       │
│ location                │
│ year_graduated          │
│ current_job             │
│ company                 │
│ bio                     │
│ email                   │
│ phone                   │
│ linkedin_url            │
│ created_at              │
│ updated_at              │
└──────────┬──────────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────┐
│    gallery_images       │
├─────────────────────────┤
│ id (PK)                 │
│ profile_id (FK)         │
│ image_url               │
│ caption                 │
│ image_type              │
│ order_index             │
│ created_at              │
└─────────────────────────┘
```

---

## ✅ Checklist

- [x] Create `profiles` table
- [x] Create `gallery_images` table
- [x] Add indexes for performance
- [x] Enable RLS on both tables
- [x] Create public read policies
- [x] Create authenticated write policies
- [x] Create `profile-images` storage bucket
- [x] Create `gallery-images` storage bucket
- [x] Configure bucket access (public)
- [x] Set file size limits (5 MB)
- [x] Configure allowed mime types
- [x] Create update trigger
- [x] Fix security advisories
- [x] Verify all configurations

---

## 🎉 Summary

**Database Status**: ✅ Fully Configured and Ready

- **Tables Created**: 2
- **Indexes Created**: 3
- **RLS Policies**: 7
- **Storage Buckets**: 2
- **Functions**: 1
- **Triggers**: 1
- **Security Status**: ✅ Passed

**Ready for**:
1. Alumni data import (134 profiles)
2. Image uploads
3. Production deployment

---

**Documentation**: See `scripts/` folder for import guides
**Import Command**: `npm run import:alumni`
**Validation**: `npm run validate:alumni`
