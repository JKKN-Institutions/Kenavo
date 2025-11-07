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

      {/* Spacer - Responsive height */}
      <div className="flex min-h-[70px] sm:min-h-[80px] md:min-h-[147px] xl:min-h-[80px] w-full" />

      <main className="w-full flex-grow">
        {/* Profile Hero Section */}
        <div className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-6">
          <ProfileHero
            name={profile.name}
            profileImageUrl={profile.profile_image_url}
            yearGraduated={profile.year_graduated}
            designationOrganisation={profile.designation_organisation}
            currentJob={profile.current_job}
            location={profile.location}
            nicknames={profile.nicknames}
            updatedAt={profile.updated_at}
          />
        </div>

        {/* Q&A Section */}
        <section
          className="self-center flex w-full max-w-[1200px] flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-10 mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-16"
          aria-label="Questions and Answers"
        >
          {/* Section Title */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-10">
            <h2 className="text-[rgba(217,81,100,1)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-bold leading-tight xl:leading-[1.2] mb-2 sm:mb-3 md:mb-4">
              Get to Know Me Better
            </h2>
            <p className="text-[rgba(254,249,232,0.8)] text-sm sm:text-base md:text-lg">
              Explore questions and answers about my journey
            </p>
          </div>

          {/* Q&A List */}
          {profile.qa_responses && profile.qa_responses.length > 0 ? (
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {profile.qa_responses.map((qa, index) => (
                <QuestionAnswer
                  key={qa.question_id}
                  question={qa.question_text}
                  answer={qa.answer || 'No answer provided'}
                  isExpanded={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm rounded-lg border border-[rgba(217,81,100,0.1)]">
              <div className="max-w-md mx-auto px-4">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-[rgba(217,81,100,0.5)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-[rgba(254,249,232,1)] text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
                  No Q&A responses available yet
                </p>
                <p className="text-[rgba(254,249,232,0.7)] text-sm sm:text-base md:text-lg">
                  Check back later for updates
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
