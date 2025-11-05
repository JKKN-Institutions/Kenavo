import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileHero from '@/components/ProfileHero';
import QuestionAnswer from '@/components/QuestionAnswer';
import { getProfileBySlug, getAllProfileSlugs } from '@/lib/api/profiles';

// Enable on-demand revalidation (triggered by admin updates via /api/revalidate)
// This provides instant updates without the performance cost of fully dynamic pages
// Profiles are cached until explicitly revalidated by the admin panel
export const revalidate = false; // No time-based revalidation, only on-demand

// Generate static paths for ALL 134 profiles
export async function generateStaticParams() {
  try {
    const slugs = await getAllProfileSlugs();
    return slugs.map(({ slug }) => ({ id: slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Allow dynamic routes for any other profile IDs at runtime
export const dynamicParams = true;

export default async function DirectoryIndividualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;

  // Fetch profile data by slug
  let profile;
  try {
    profile = await getProfileBySlug(slug);
  } catch (error) {
    console.error('Error fetching profile:', error);
    notFound();
  }

  // If profile not found, show 404
  if (!profile) {
    notFound();
  }

  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-stretch min-h-screen">
      <Header />

      <div className="flex min-h-[147px] w-full max-md:max-w-full" />

      <main className="w-full">
        <ProfileHero
          name={profile.name}
          profileImageUrl={profile.profile_image_url}
          yearGraduated={profile.year_graduated}
          company={profile.company}
          currentJob={profile.current_job}
          location={profile.location}
          nicknames={profile.nicknames}
          updatedAt={profile.updated_at}
        />

        <section className="self-center flex w-full max-w-[969px] flex-col px-4 md:px-6 lg:px-5 mb-12 md:mb-16 lg:mb-20" aria-label="Questions and Answers">
          {profile.qa_responses && profile.qa_responses.length > 0 ? (
            profile.qa_responses.map((qa, index) => (
              <QuestionAnswer
                key={qa.question_id}
                question={qa.question_text}
                answer={qa.answer || 'No answer provided'}
                isExpanded={index === 0}
              />
            ))
          ) : (
            <div className="text-white text-center py-8 md:py-10 lg:py-12">
              <p className="text-lg md:text-xl lg:text-2xl">No Q&A responses available yet</p>
              <p className="text-xs md:text-sm lg:text-base mt-2 opacity-75">Check back later for updates</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
