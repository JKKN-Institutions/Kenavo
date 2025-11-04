# Profile System Analysis - Kenavo Alumni Directory

## Executive Summary

The Kenavo alumni directory application has a read-only profile system for displaying alumni information. The system currently does NOT have profile editing/update functionality - it only supports viewing and displaying profiles from the Supabase database.

**Key Finding**: Profiles are currently imported via data scripts and cannot be edited through the web interface.

---

## 1. Profile Display Architecture

### Pages/Routes

#### /directory - Alumni Directory Listing
- **File**: app/directory/page.tsx
- **Type**: Client-side rendered page (use client)
- **Features**:
  - Fetches all profiles from Supabase using getAllProfiles()
  - Groups alumni alphabetically by first name
  - Displays 3-column grid of profile cards
  - Real-time loading/error states
  - Alphabet navigation with anchor links

#### /directory/[id] - Individual Profile Page
- **File**: app/directory/[id]/page.tsx
- **Type**: Static + Dynamic routes
- **Features**:
  - Displays full profile with hero image
  - Shows 10 Q&A answers (hardcoded for each user)
  - Static params for pre-generation (9 profiles listed)
  - Dynamic params allowed for runtime profile access

#### /gallery/[id] - Gallery Album View
- **File**: app/gallery/[id]/page.tsx
- **Type**: Static gallery albums (not profile-specific)
- **Albums**: group, sports, hostel, tours, events, annual-day

---

## 2. Profile Components

### ProfileHero Component
- **File**: components/ProfileHero.tsx
- **Purpose**: Displays main profile information in hero format
- **Fields Displayed**:
  - Profile image (left side)
  - Name (large heading)
  - Tenure at school
  - Company/Organization
  - Current residential address
  - Nicknames

**Current Implementation**:
- HARDCODED DATA: Currently displays "Chenthil Aruun Mohan" with fixed information
- No dynamic data binding to profile props
- Static component that needs refactoring to accept profile data

### ProfileCard Component
- **File**: components/ProfileCard.tsx
- **Purpose**: Reusable card component for directory listings
- **Props**:
  - name: string
  - imageUrl: string
  - backgroundImageUrl?: optional background
  - className?: optional styling

**Features**:
- Displays profile image with optional background
- Shows profile name
- "View More" link button
- Hover effects

---

## 3. Database Schema

### profiles Table
**Location**: Supabase PostgreSQL Database

**Columns**:
| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| id | INTEGER | NO | PRIMARY KEY |
| name | VARCHAR(255) | NO | UNIQUE |
| profile_image_url | TEXT | YES | - |
| location | VARCHAR(255) | YES | - |
| year_graduated | VARCHAR(4) | YES | Default: 2000 |
| current_job | VARCHAR(255) | YES | - |
| company | VARCHAR(255) | YES | - |
| bio | TEXT | YES | - |
| email | VARCHAR(255) | YES | - |
| phone | VARCHAR(50) | YES | - |
| linkedin_url | TEXT | YES | - |
| created_at | TIMESTAMPTZ | NO | Default: NOW() |
| updated_at | TIMESTAMPTZ | NO | Default: NOW() |

**Indexes**:
- idx_profiles_name - Fast name searches
- idx_profiles_year - Graduation year filtering

### gallery_images Table

| Column | Type | Nullable | Constraints |
|--------|------|----------|-------------|
| id | SERIAL | NO | PRIMARY KEY |
| profile_id | INTEGER | NO | FOREIGN KEY → profiles(id) |
| image_url | TEXT | NO | - |
| caption | TEXT | YES | - |
| image_type | VARCHAR(50) | YES | Default: gallery |
| order_index | INTEGER | YES | Default: 0 |
| created_at | TIMESTAMPTZ | NO | Default: NOW() |

---

## 4. Profile API Functions

**File**: lib/api/profiles.ts

### Available Functions

#### getAllProfiles()
- Fetches all alumni profiles
- Ordered by name alphabetically
- No filtering or pagination

#### getProfilesByYear(year: string)
- Filters profiles by graduation year
- Ordered by name

#### getProfileById(id: number)
- Fetches single profile with gallery images
- Performs LEFT JOIN with gallery_images
- Not currently used in directory (uses slug-based routing)

#### searchProfiles(searchTerm: string)
- Searches by name or location (case-insensitive)
- Uses ilike PostgreSQL operator
- Currently not implemented in UI

#### getProfilesCount()
- Returns total number of profiles
- Used for statistics

#### getGraduationYears()
- Returns unique graduation years
- Currently not used in UI

---

## 5. Profile TypeScript Interfaces

**File**: lib/types/database.ts

```typescript
export interface Profile {
  id: number
  name: string
  profile_image_url: string | null
  location: string | null
  year_graduated: string | null
  current_job: string | null
  company: string | null
  bio: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  created_at: string
  updated_at: string
}
```

---

## 6. What Profile Fields are USED

### Currently Displayed in UI:

**Directory Listing** (/directory):
- ✅ name
- ✅ profile_image_url

**Individual Profile** (/directory/[id]):
- ✅ name (in heading)
- ✅ profile_image_url
- ⚠️ year_graduated (hardcoded example)
- ⚠️ company (hardcoded example)
- ⚠️ location (hardcoded example)
- ❌ Q&A answers (completely hardcoded, not in database)

### Currently NOT USED:
- ❌ current_job
- ❌ bio
- ❌ email
- ❌ phone
- ❌ linkedin_url

---

## 7. Profile Edit/Update Functionality

### Current Status: DOES NOT EXIST

**What Exists**:
- ✅ Database schema supports updates (has updated_at trigger)
- ✅ RLS policy allows authenticated users to UPDATE
- ❌ No UI form for editing profiles
- ❌ No API routes for profile updates
- ❌ No authentication system

**What Would be Needed**:
1. Authentication system to identify users
2. Profile edit page (/profile/[id]/edit)
3. Edit form component with all profile fields
4. API route (PUT /api/profiles/[id])
5. File upload handler for profile images
6. Authorization checks for profile ownership

---

## 8. File Structure

```
C:\Users\admin\Projects\KenavoFinal\
├── app\
│   ├── directory\
│   │   ├── page.tsx                # Directory listing
│   │   └── [id]\page.tsx          # Individual profile
│   └── gallery\
│       └── [id]\page.tsx          # Gallery albums
│
├── components\
│   ├── ProfileHero.tsx            # Profile hero (HARDCODED)
│   ├── ProfileCard.tsx            # Profile card
│   └── ContactForm.tsx            # Contact form
│
├── lib\
│   ├── api\
│   │   └── profiles.ts            # Profile API functions
│   ├── types\
│   │   └── database.ts            # TypeScript interfaces
│   └── supabase.ts                # Supabase client
│
└── DATABASE_SETUP_COMPLETE.md     # Schema documentation
```

---

## Key Findings

### Strengths
1. Clean separation of concerns
2. Proper TypeScript types
3. Supabase integration working
4. RLS enabled on tables
5. Performance indexes created

### Issues
1. ProfileHero component is hardcoded with example data
2. Q&A answers are hardcoded in component
3. Search functionality exists but not exposed in UI
4. No profile ownership system
5. No edit/update capability
6. Profile routing uses name slugs (fragile)

---

## Summary Table

| Aspect | Status | Location |
|--------|--------|----------|
| Profile Display | ✅ Complete | /directory, /directory/[id] |
| Database Schema | ✅ Complete | profiles, gallery_images tables |
| API Read Functions | ✅ Complete | lib/api/profiles.ts |
| API Write Functions | ❌ None | - |
| Authentication | ❌ None | - |
| Edit UI | ❌ None | - |
| File Upload Handler | ❌ None | - |
| Search UI | ❌ None | - |
| Profile Ownership | ❌ None | - |

---

**Document Generated**: 2025-11-04
**System**: Kenavo Alumni Directory
