# Supabase Frontend Integration Guide

## ✅ Integration Complete!

Your Kenavo Alumni Directory is now fully integrated with Supabase.

## 📁 Files Created

### 1. **lib/supabase.ts** ✅
Supabase client configuration (already exists)

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 2. **lib/types/database.ts** ✅ NEW
TypeScript type definitions for your database schema

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

export interface GalleryImage {
  id: number
  profile_id: number
  image_url: string
  caption: string | null
  image_type: string | null
  order_index: number | null
  created_at: string
}
```

### 3. **lib/api/profiles.ts** ✅ NEW
Ready-to-use API functions for fetching data

Available Functions:
- `getAllProfiles()` - Fetch all 134 profiles
- `getProfilesByYear(year)` - Filter by graduation year
- `getProfileById(id)` - Get single profile with gallery images
- `searchProfiles(searchTerm)` - Search by name or location
- `getProfilesCount()` - Get total count
- `getGraduationYears()` - Get unique years

### 4. **app/supabase-demo/page.tsx** ✅ NEW
Live demo page showing the integration in action

## 🚀 Usage Examples

### Basic Profile Listing

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getAllProfiles } from '@/lib/api/profiles'
import type { Profile } from '@/lib/types/database'

export default function DirectoryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    async function loadProfiles() {
      const data = await getAllProfiles()
      setProfiles(data)
    }
    loadProfiles()
  }, [])

  return (
    <div>
      {profiles.map(profile => (
        <div key={profile.id}>
          <h2>{profile.name}</h2>
          <img src={profile.profile_image_url || ''} alt={profile.name} />
          <p>{profile.location}</p>
          <p>Class of {profile.year_graduated}</p>
        </div>
      ))}
    </div>
  )
}
```

### Search Functionality

```typescript
import { searchProfiles } from '@/lib/api/profiles'

async function handleSearch(query: string) {
  const results = await searchProfiles(query)
  console.log(`Found ${results.length} matches`)
}
```

### Filter by Year

```typescript
import { getProfilesByYear } from '@/lib/api/profiles'

async function showClass2000() {
  const profiles = await getProfilesByYear('2000')
  // Display profiles from Class of 2000
}
```

### Profile Detail Page

```typescript
import { getProfileById } from '@/lib/api/profiles'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await getProfileById(parseInt(params.id))

  return (
    <div>
      <h1>{profile?.name}</h1>
      <img src={profile?.profile_image_url || ''} alt={profile?.name} />
      <p>{profile?.bio}</p>

      {/* Gallery Images */}
      {profile?.gallery_images.map(img => (
        <img key={img.id} src={img.image_url} alt={img.caption || ''} />
      ))}
    </div>
  )
}
```

## 🧪 Test the Integration

Visit the demo page to see it in action:

```bash
npm run dev
```

Then navigate to: **http://localhost:3000/supabase-demo**

You should see:
- ✅ All 134 alumni profiles loaded from Supabase
- ✅ Profile images from Supabase Storage
- ✅ Real-time data from your database
- ✅ Stats: Total count, photos, locations, years

## 📊 Database Overview

### Current Data Status
- **Profiles**: 134/134 ✓
- **Images**: 134/134 ✓
- **Storage Bucket**: `profile-images/alumni/` ✓

### Image URLs Format
All images are publicly accessible at:
```
https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/{id}-{name}.png
```

Example:
```
https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/1-a-arjoon.png
```

## 🔒 Security & Performance

### Row Level Security (RLS)
Your database has proper RLS policies:
- ✅ Public read access for all profiles
- ✅ Authenticated write access only
- ✅ Storage buckets are public (read-only for anonymous users)

### Performance Optimizations
- ✅ Indexed on `name`, `year_graduated`
- ✅ Automatic `updated_at` timestamps
- ✅ Foreign key cascade deletes

## 📝 Adding New Features

### Add a Profile Update Form

```typescript
import { supabase } from '@/lib/supabase'

async function updateProfile(id: number, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Add Gallery Images

```typescript
import { supabase } from '@/lib/supabase'

async function addGalleryImage(profileId: number, imageUrl: string, caption?: string) {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      profile_id: profileId,
      image_url: imageUrl,
      caption: caption,
      image_type: 'gallery'
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Upload New Image to Storage

```typescript
import { supabase } from '@/lib/supabase'

async function uploadImage(file: File, profileId: number) {
  const fileName = `${profileId}-${Date.now()}.${file.name.split('.').pop()}`

  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(`alumni/${fileName}`, file, {
      upsert: false
    })

  if (error) throw error

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('profile-images')
    .getPublicUrl(`alumni/${fileName}`)

  return publicUrlData.publicUrl
}
```

## 🎨 Integrate with Your Existing Design

To replace the hardcoded data in your existing test-directory page:

1. Import the API functions:
```typescript
import { getAllProfiles } from '@/lib/api/profiles'
import type { Profile } from '@/lib/types/database'
```

2. Replace the hardcoded `alumniData` with a `useEffect` hook:
```typescript
const [profiles, setProfiles] = useState<Profile[]>([])

useEffect(() => {
  getAllProfiles().then(setProfiles)
}, [])
```

3. Update image URLs to use `profile.profile_image_url`

4. Keep your existing UI components and styling

## 🔧 Environment Variables

Your `.env.local` is already configured:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rihoufidmnqtffzqhplc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/docs/)

## ✨ Next Steps

1. ✅ Integration is complete and working
2. ✅ Test the demo page at `/supabase-demo`
3. Replace hardcoded data in existing pages with Supabase queries
4. Add search/filter functionality
5. Create individual profile detail pages
6. Add admin panel for editing profiles
7. Implement authentication for write operations

## 🎉 Success!

Your Kenavo Alumni Directory is now:
- ✅ Connected to Supabase
- ✅ All 134 profiles loaded
- ✅ All images accessible
- ✅ TypeScript types defined
- ✅ API functions ready to use
- ✅ Demo page working

**Start building your directory with real data from Supabase!**
