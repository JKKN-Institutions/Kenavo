# Profile System - Quick Reference Guide

## File Locations

| Purpose | File Path |
|---------|-----------|
| Directory listing page | app/directory/page.tsx |
| Individual profile page | app/directory/[id]/page.tsx |
| Profile hero component | components/ProfileHero.tsx |
| Profile card component | components/ProfileCard.tsx |
| Profile API functions | lib/api/profiles.ts |
| Database types | lib/types/database.ts |
| Supabase client | lib/supabase.ts |

## Profile Database Fields

```
profiles table
├── id (INTEGER, PRIMARY KEY)
├── name (VARCHAR, UNIQUE)
├── profile_image_url (TEXT)
├── location (VARCHAR)
├── year_graduated (VARCHAR)
├── current_job (VARCHAR)
├── company (VARCHAR)
├── bio (TEXT)
├── email (VARCHAR)
├── phone (VARCHAR)
├── linkedin_url (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## API Functions Available

```typescript
// lib/api/profiles.ts

getAllProfiles()              // Returns all profiles
getProfilesByYear(year)       // Filter by graduation year
getProfileById(id)            // Get single profile with gallery
searchProfiles(term)          // Search by name/location
getProfilesCount()            // Get total count
getGraduationYears()          // Get unique years
```

## Profile Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| /directory | app/directory/page.tsx | List all alumni |
| /directory/[id] | app/directory/[id]/page.tsx | Individual profile |
| /gallery/[id] | app/gallery/[id]/page.tsx | Gallery albums |

## Key Issues

### 1. ProfileHero is Hardcoded
**File**: components/ProfileHero.tsx
**Problem**: Displays "Chenthil Aruun Mohan" with static data
**Solution**: Convert to accept profile props

**Before**:
```typescript
// Static hardcoded
<h1>Chenthil<br />Aruun Mohan</h1>
<div>1990-1998</div>
```

**After**:
```typescript
interface ProfileHeroProps {
  profile: Profile;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <>
      <h1>{profile.name}</h1>
      <div>{profile.year_graduated}</div>
      {/* ... more fields */}
    </>
  );
}
```

### 2. Q&A Answers are Hardcoded
**File**: app/directory/[id]/page.tsx
**Problem**: Q&A answers are hardcoded in the page component
**Solution**: Create a database table for Q&A or import from external source

**Current**:
```typescript
const questionsAndAnswers = [
  {
    question: "A school memory...",
    answer: "Diwalis with nerds"
  },
  // ... 9 more hardcoded answers
];
```

### 3. No Edit Functionality
**Problem**: No way to update profile information
**Solution needed**:
- Authentication system
- Edit form component
- API route for updates
- File upload handler

### 4. Slug-Based Routing is Fragile
**Problem**: Uses name slugs instead of IDs
**Current**: /directory/a-arjoon
**Better**: /directory/1 (uses profile ID)

## Testing Profile Features

### Fetch all profiles
```bash
curl 'https://your-project.supabase.co/rest/v1/profiles' \
  -H 'apikey: your-anon-key'
```

### Search profiles
Go to `/directory` and use the alphabet navigation

### View individual profile
Click "View More" on any profile card at `/directory`

## Database Operations

### View profiles in Supabase
1. Go to Supabase dashboard
2. SQL Editor
3. Run: `SELECT id, name, location, profile_image_url FROM profiles LIMIT 10;`

### Add a new profile
```sql
INSERT INTO profiles (
  id, name, location, year_graduated, company
) VALUES (
  135, 'John Doe', 'New York', '2000', 'Tech Corp'
);
```

### Update a profile
```sql
UPDATE profiles 
SET company = 'New Company'
WHERE id = 1;
-- updated_at is automatically set
```

## Component Props

### ProfileCard
```typescript
interface ProfileCardProps {
  name: string;
  imageUrl: string;
  backgroundImageUrl?: string;
  className?: string;
}
```

### ProfileHero (Current - Hardcoded)
```typescript
// No props - should accept:
interface ProfileHeroProps {
  profile: Profile;
}
```

## Storage Buckets

| Bucket | Path Pattern | Usage |
|--------|--------------|-------|
| profile-images | alumni/{id}-{name}.png | Profile photos |
| gallery-images | {profile-id}/filename | Gallery photos |

## Important Notes

1. **No Authentication**: System doesn't have user auth yet
2. **No Ownership**: No way to identify profile owner
3. **Read-Only UI**: All profiles can only be viewed
4. **Import Only**: Data added via scripts, not web form
5. **Hardcoded Data**: Example data mixed with component code

## Next Steps to Enable Editing

1. [ ] Add Supabase Auth
2. [ ] Create profile_ownership table
3. [ ] Update RLS policies for ownership checks
4. [ ] Create ProfileEditForm component
5. [ ] Create /profile/[id]/edit route
6. [ ] Add PUT /api/profiles/[id] endpoint
7. [ ] Implement file upload for images
8. [ ] Add profile photo update functionality

## Deployment Notes

- Uses Supabase (PostgreSQL)
- Public read access enabled
- Authenticated users can insert/update
- Images stored in Supabase Storage
- Uses ANON_KEY for client (public operations)
