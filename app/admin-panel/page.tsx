'use client';

import React, { useState, useEffect } from 'react';
import { Upload, UserPlus, CheckCircle, AlertCircle, Edit2, Search, X, Save, List, LogOut, Image as ImageIcon, RefreshCw, Mail, Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/client';
import BulkImagePreviewModal, { ImageMapping } from '@/components/admin/BulkImagePreviewModal';
import GalleryManagementTab from '@/components/admin/GalleryManagementTab';
import ContactSubmissionsTab from '@/components/ContactSubmissionsTab';
import UserManagementTab from '@/components/admin/UserManagementTab';
import AIDocumentsTab from '@/components/admin/AIDocumentsTab';

type TabType = 'manage' | 'bulkUpdate' | 'single' | 'gallery' | 'contact' | 'users' | 'ai-documents';

// Helper function to parse CSV line (handles quoted values with commas)
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

interface Profile {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  year_graduated: string | null;
  current_job: string | null;
  company: string | null;
  designation_organisation: string | null;
  bio: string | null;
  linkedin_url: string | null;
  nicknames: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface QAResponse {
  question_id: number;
  question_text: string;
  answer: string | null;
  order_index: number;
}

interface Question {
  id: number;
  question_text: string;
  order_index: number;
}

export default function AdminPanel() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Initialize activeTab from URL or default to 'manage'
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as TabType;
      if (tab && ['manage', 'bulkUpdate', 'single', 'gallery', 'contact', 'users'].includes(tab)) {
        return tab;
      }
    }
    return 'manage';
  });

  // Update URL when tab changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !authChecking) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', activeTab);
      window.history.replaceState({}, '', url.toString());
    }
  }, [activeTab, authChecking]);

  // Check authorization on mount
  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      const response = await fetch('/api/auth/check-admin');
      const result = await response.json();

      if (!result.authorized) {
        console.error('❌ Unauthorized access attempt to admin panel');
        router.push('/login?error=access_denied');
        return;
      }

      console.log('✅ Admin authorization confirmed');
      setAuthChecking(false);
    } catch (error) {
      console.error('Error checking authorization:', error);
      router.push('/login?error=auth_failed');
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await signOut();

    if (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
      return;
    }

    router.push('/login');
    router.refresh();
  };

  // Show loading state while checking authorization
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#4E2E8C] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-brand-yellow mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">Verifying authorization...</p>
          <p className="text-white/70 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7ff] via-white to-[#faf5ff] relative overflow-hidden">
      {/* Ultra-Modern Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Mesh Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Sophisticated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Premium Glassmorphism Header */}
        <header className="backdrop-blur-xl bg-white/60 border-b border-purple-200/50 sticky top-0 z-50 shadow-[0_8px_32px_0_rgba(78,46,140,0.12)]">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              {/* Modern Logo & Title */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  {/* Floating Logo with Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] to-[#7C3AED] rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-black text-2xl tracking-tight">K</span>
                  </div>
                  {/* Pulse Indicator */}
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-lg"></span>
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] bg-clip-text text-transparent tracking-tight">Kenavo Admin</h1>
                  <p className="text-sm font-medium text-neutral-600">Premium Management Dashboard</p>
                </div>
              </div>

              {/* Sophisticated User Actions */}
              <div className="flex items-center gap-4">
                {/* Modern Sign Out Button */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="group relative flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <LogOut size={18} className="relative z-10" />
                  <span className="relative z-10">{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 container mx-auto px-6 lg:px-8 py-10">
          {/* Ultra-Modern Tab Navigation */}
          <nav className="mb-10">
            <div className="relative backdrop-blur-md bg-white/80 p-2 rounded-2xl border border-purple-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'manage'
                      ? 'text-white'
                      : 'text-neutral-700 hover:text-[#4E2E8C] hover:bg-purple-50/50'
                  }`}
                >
                  {activeTab === 'manage' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] rounded-xl shadow-lg"></div>
                  )}
                  <List size={18} className="relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Profiles</span>
                  {activeTab === 'manage' && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('bulkUpdate')}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'bulkUpdate'
                      ? 'text-white'
                      : 'text-neutral-700 hover:text-[#4E2E8C] hover:bg-purple-50/50'
                  }`}
                >
                  {activeTab === 'bulkUpdate' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] rounded-xl shadow-lg"></div>
                  )}
                  <Upload size={18} className="relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Import</span>
                </button>
                <button
                  onClick={() => setActiveTab('single')}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'single'
                      ? 'text-white'
                      : 'text-neutral-700 hover:text-[#4E2E8C] hover:bg-purple-50/50'
                  }`}
                >
                  {activeTab === 'single' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] rounded-xl shadow-lg"></div>
                  )}
                  <UserPlus size={18} className="relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Create</span>
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'gallery'
                      ? 'text-white'
                      : 'text-neutral-700 hover:text-[#4E2E8C] hover:bg-purple-50/50'
                  }`}
                >
                  {activeTab === 'gallery' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] rounded-xl shadow-lg"></div>
                  )}
                  <ImageIcon size={18} className="relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Gallery</span>
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'contact'
                      ? 'text-white'
                      : 'text-neutral-700 hover:text-[#4E2E8C] hover:bg-purple-50/50'
                  }`}
                >
                  {activeTab === 'contact' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] rounded-xl shadow-lg"></div>
                  )}
                  <Mail size={18} className="relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Messages</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'users'
                      ? 'text-white'
                      : 'text-neutral-700 hover:text-[#4E2E8C] hover:bg-purple-50/50'
                  }`}
                >
                  {activeTab === 'users' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] rounded-xl shadow-lg"></div>
                  )}
                  <Users size={18} className="relative z-10" />
                  <span className="relative z-10 hidden sm:inline">Users</span>
                </button>
                <button
                  onClick={() => setActiveTab('ai-documents')}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'ai-documents'
                      ? 'text-white'
                      : 'text-neutral-700 hover:text-[#4E2E8C] hover:bg-purple-50/50'
                  }`}
                >
                  {activeTab === 'ai-documents' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E2E8C] via-[#6D28D9] to-[#7C3AED] rounded-xl shadow-lg"></div>
                  )}
                  <Sparkles size={18} className="relative z-10" />
                  <span className="relative z-10 hidden sm:inline">AI Docs</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Premium Content Card with Glassmorphism */}
          <main className="relative backdrop-blur-md bg-white/70 rounded-3xl border border-purple-200/50 shadow-[0_20px_70px_-15px_rgba(78,46,140,0.3)] overflow-hidden">
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-white/50 pointer-events-none"></div>

            <div className="relative p-10">
              {activeTab === 'manage' && <ManageProfilesTab />}
              {activeTab === 'bulkUpdate' && <BulkUpdateTab />}
              {activeTab === 'single' && <SingleProfileForm />}
              {activeTab === 'gallery' && <GalleryManagementTab />}
              {activeTab === 'contact' && <ContactSubmissionsTab />}
              {activeTab === 'users' && <UserManagementTab />}
              {activeTab === 'ai-documents' && <AIDocumentsTab />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// NEW: Manage Profiles Tab
function ManageProfilesTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, [page, searchTerm, yearFilter]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(yearFilter && { year: yearFilter }),
        _t: Date.now().toString(), // Cache buster
      });

      const response = await fetch(`/api/admin/list-profiles?${params}`, {
        cache: 'no-store', // Disable caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setProfiles(data.profiles);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
  };

  const handleCloseEdit = async () => {
    setEditingProfile(null);
    // Force a complete refresh with cache bypass
    await fetchProfiles();
  };

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-neutral-200">
        <div>
          <h2 className="text-2xl font-bold text-[#4E2E8C] tracking-tight">Profile Management</h2>
          <p className="text-neutral-600 text-sm mt-1">{totalCount} profiles in database</p>
        </div>
        <button
          onClick={fetchProfiles}
          className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] text-white text-sm font-bold transition-all duration-300 flex items-center gap-2.5 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <RefreshCw size={16} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline relative z-10">Refresh</span>
        </button>
      </div>

      {/* Advanced Search Bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, location, or organization..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            />
          </div>
        </div>
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 rounded-lg bg-white text-[#4E2E8C] border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm cursor-pointer transition-all shadow-sm hover:bg-neutral-50"
        >
          <option value="">All Years</option>
          <option value="2005">2005</option>
          <option value="2006">2006</option>
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
        </select>
      </div>

      {/* Profile List with Enhanced Cards */}
      {loading ? (
        <div className="text-neutral-600 text-center py-16 bg-neutral-50 rounded-xl border-2 border-neutral-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-neutral-200 border-t-brand-green mb-4"></div>
          <p className="text-sm font-medium">Loading profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-neutral-600 text-center py-16 bg-neutral-50 rounded-xl border-2 border-neutral-200">
          <p className="text-sm font-medium text-[#4E2E8C]">No profiles found</p>
          <p className="text-xs text-neutral-500 mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-xl p-4 flex items-center justify-between hover:bg-[#4E2E8C]/5 transition-all duration-200 border-2 border-neutral-200 hover:border-[#4E2E8C] group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 ring-2 ring-neutral-200 group-hover:ring-[#4E2E8C] transition-all">
                  <img
                    src={profile.profile_image_url || '/placeholder-profile.svg'}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-profile.svg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#4E2E8C] font-semibold text-base truncate group-hover:text-[#5E3E9C] transition-colors">{profile.name}</h3>
                  <p className="text-neutral-600 text-sm truncate mt-0.5">
                    {profile.year_graduated && <span className="font-medium text-[#4E2E8C]">{profile.year_graduated}</span>}
                    {profile.location && <span> · {profile.location}</span>}
                    {profile.designation_organisation && <span> · {profile.designation_organisation}</span>}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEdit(profile)}
                className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] text-white text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Edit2 size={16} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline relative z-10">Edit</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 mt-6 border-t-2 border-neutral-200">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Previous</span>
          </button>
          <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-[#4E2E8C] shadow-md">
            <span className="text-[#4E2E8C] font-bold text-sm">{page}</span>
            <span className="text-neutral-500 text-sm mx-1.5">/</span>
            <span className="text-[#4E2E8C] text-sm font-semibold">{totalPages}</span>
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Next</span>
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingProfile && (
        <EditProfileModal profile={editingProfile} onClose={handleCloseEdit} />
      )}
    </div>
  );
}

// Edit Profile Modal
function EditProfileModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    year_graduated: profile.year_graduated || '',
    current_job: profile.current_job || '',
    company: profile.company || '',
    designation_organisation: profile.designation_organisation || '',
    bio: profile.bio || '',
    linkedin_url: profile.linkedin_url || '',
    nicknames: profile.nicknames || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(profile.profile_image_url || '');
  const [qaAnswers, setQaAnswers] = useState<QAResponse[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingQA, setLoadingQA] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfileQA();
  }, []);

  const fetchProfileQA = async () => {
    try {
      const response = await fetch(`/api/admin/get-profile/${profile.id}?_t=${Date.now()}`, {
        cache: 'no-store', // Disable caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setQaAnswers(data.qa_responses);
        setAllQuestions(data.all_questions);
      }
    } catch (error) {
      console.error('Error fetching Q&A:', error);
    } finally {
      setLoadingQA(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQAChange = (questionId: number, answer: string) => {
    setQaAnswers(prev => {
      const existing = prev.find(qa => qa.question_id === questionId);
      if (existing) {
        return prev.map(qa => qa.question_id === questionId ? { ...qa, answer } : qa);
      } else {
        const question = allQuestions.find(q => q.id === questionId);
        return [...prev, {
          question_id: questionId,
          question_text: question?.question_text || '',
          answer,
          order_index: question?.order_index || 0
        }];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Update profile
      const profileFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        profileFormData.append(key, value);
      });
      if (imageFile) {
        profileFormData.append('image', imageFile);
      }
      profileFormData.append('existing_image_url', profile.profile_image_url || '');

      const profileResponse = await fetch(`/api/admin/update-profile/${profile.id}`, {
        method: 'PUT',
        body: profileFormData,
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileResult.error || 'Failed to update profile');
      }

      // Update Q&A answers
      const qaResponse = await fetch(`/api/admin/update-profile-qa/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: qaAnswers.map(qa => ({
            question_id: qa.question_id,
            answer: qa.answer
          }))
        }),
      });

      const qaResult = await qaResponse.json();

      if (!qaResponse.ok) {
        throw new Error(qaResult.error || 'Failed to update Q&A');
      }

      setMessage({ type: 'success', text: 'Profile and Q&A updated successfully!' });
      setTimeout(() => {
        onClose(); // This will trigger fetchProfiles() to reload with fresh data
      }, 1500);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const getAnswer = (questionId: number): string => {
    return qaAnswers.find(qa => qa.question_id === questionId)?.answer || '';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-neutral-200 shadow-2xl">
        <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-[#4E2E8C] tracking-tight">Edit Profile</h2>
            <p className="text-brand-yellow font-semibold mt-1 text-base bg-[#4E2E8C] px-3 py-1 rounded-md inline-block">{profile.name}</p>
          </div>
          <button
            onClick={onClose}
            className="group relative text-neutral-400 hover:text-white backdrop-blur-md bg-neutral-100/50 hover:bg-gradient-to-r hover:from-[#4E2E8C] hover:to-[#6D28D9] transition-all duration-300 p-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-110"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload with Enhanced Preview */}
          <div className="space-y-3">
            <label className="block text-[#4E2E8C] font-semibold text-sm">Profile Image</label>
            <div className="flex items-center gap-5">
              {imagePreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-[#4E2E8C] bg-neutral-100 shadow-md">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
                </div>
              )}
              <label className="group relative cursor-pointer bg-gradient-to-r from-brand-yellow to-accent-400 text-[#4E2E8C] px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2.5 text-sm shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Upload size={18} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">{imageFile ? 'Change Image' : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Professional Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Full Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Year Graduated</label>
              <input
                type="text"
                name="year_graduated"
                value={formData.year_graduated}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Current Job</label>
              <input
                type="text"
                name="current_job"
                value={formData.current_job}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Nicknames</label>
              <input
                type="text"
                name="nicknames"
                value={formData.nicknames}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm resize-none transition-all shadow-sm"
            />
          </div>

          {/* Q&A Section with Enhanced Design */}
          <div className="border-t-2 border-neutral-200 pt-6">
            <h3 className="text-xl font-bold text-[#4E2E8C] mb-4 tracking-tight">Q&A Answers</h3>
            {loadingQA ? (
              <div className="text-neutral-600 text-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-neutral-200 border-t-brand-green rounded-full animate-spin"></div>
                Loading questions...
              </div>
            ) : (
              <div className="space-y-4">
                {allQuestions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">{question.question_text}</label>
                    <textarea
                      value={getAnswer(question.id)}
                      onChange={(e) => handleQAChange(question.id, e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm resize-none transition-all shadow-sm"
                      placeholder="Enter answer..."
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Status Message */}
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium shadow-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border-2 border-green-200'
                  : 'bg-red-50 text-red-700 border-2 border-red-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Professional Action Buttons */}
          <div className="flex gap-3 pt-6 border-t-2 border-neutral-200">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex-1 bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                  <span className="relative z-10">Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Save Changes</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="group relative px-6 py-3 rounded-xl backdrop-blur-md bg-white/80 hover:bg-white text-[#4E2E8C] font-bold text-base transition-all duration-300 border-2 border-neutral-200 hover:border-[#4E2E8C] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-105"
            >
              <span className="relative z-10">Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// NEW: Bulk Update Tab
function BulkUpdateTab() {
  const router = useRouter();
  const [exportLoading, setExportLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Complete Slambook Upload State
  const [slambookFile, setSlambookFile] = useState<File | null>(null);
  const [slambookLoading, setSlambookLoading] = useState(false);
  const [slambookMessage, setSlambookMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Bulk Image Upload State
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageMessage, setImageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewMappings, setPreviewMappings] = useState<ImageMapping[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Export Profile IDs function
  const exportProfileIds = async () => {
    try {
      const response = await fetch('/api/admin/export-profile-ids');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile_ids_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading profile IDs:', error);
    }
  };

  // Download bulk update template
  const downloadBulkUpdateTemplate = () => {
    const a = document.createElement('a');
    a.href = '/templates/bulk_update_template.csv';
    a.download = 'bulk_update_template.csv';
    a.click();
  };

  // Download image naming guide
  const downloadImageGuide = () => {
    const a = document.createElement('a');
    a.href = '/templates/image_naming_guide.txt';
    a.download = 'image_naming_guide.txt';
    a.click();
  };

  const handleExportProfiles = async () => {
    setExportLoading(true);
    try {
      const response = await fetch('/api/admin/list-profiles?limit=200');
      const data = await response.json();

      if (response.ok) {
        // Convert to CSV
        const profiles = data.profiles;
        const headers = ['id', 'name', 'email', 'phone', 'location', 'year_graduated', 'current_job', 'company', 'bio', 'linkedin_url', 'nicknames'];
        const csvContent = [
          headers.join(','),
          ...profiles.map((p: Profile) =>
            headers.map(h => {
              const value = p[h as keyof Profile] || '';
              return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',')
          )
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profiles_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        setMessage({ type: 'success', text: `Exported ${profiles.length} profiles successfully!` });
      } else {
        setMessage({ type: 'error', text: 'Failed to export profiles' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error during export' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setLoading(true);
    setMessage(null);

    try {
      // Read CSV and parse
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));

      // Must have ID column for updates
      if (!headers.includes('id')) {
        setMessage({ type: 'error', text: 'CSV must contain "id" column for updates' });
        setLoading(false);
        return;
      }

      const rows = lines.slice(1).map(line => {
        const values = parseCSVLine(line); // Use proper CSV parser
        const row: any = {};
        headers.forEach((h, i) => {
          // Remove surrounding quotes and trim
          const cleanValue = values[i] ? values[i].trim().replace(/^"|"$/g, '') : null;
          row[h] = cleanValue;
        });
        return row;
      });

      // Update each profile
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const row of rows) {
        if (!row.id) continue;

        try {
          console.log(`Processing profile ${row.id}:`, row);

          // Validate year_graduated length (database constraint: VARCHAR(4))
          if (row.year_graduated && row.year_graduated.length > 4) {
            const error = `Profile ID ${row.id}: year_graduated "${row.year_graduated}" exceeds 4 characters. Use format: "2024"`;
            console.error(error);
            errors.push(error);
            errorCount++;
            continue;
          }

          // Build FormData with only fields that have values (PATCH semantics)
          const formData = new FormData();
          Object.entries(row).forEach(([key, value]) => {
            // Only append if field has a non-empty value
            if (key !== 'id' && value !== undefined && value !== null && value !== '') {
              formData.append(key, value as string);
            }
          });
          // Don't send profile_image_url - API will preserve it automatically (PATCH behavior)

          const response = await fetch(`/api/admin/update-profile/${row.id}`, {
            method: 'PUT',
            body: formData,
          });

          if (response.ok) {
            console.log(`✅ Profile ${row.id} updated successfully`);
            successCount++;
          } else {
            const result = await response.json();
            const error = `Profile ID ${row.id}: ${result.error || 'Update failed'}`;
            console.error(`❌ ${error}`);
            errors.push(error);
            errorCount++;
          }
        } catch (error: any) {
          const errorMsg = `Profile ID ${row.id}: ${error.message || 'Network error'}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
          errorCount++;
        }
      }

      // Show detailed error messages
      console.log(`Bulk update complete: ${successCount} success, ${errorCount} errors`);
      console.log('All errors:', errors);

      let messageText = '';
      let messageType: 'success' | 'error' = 'error';

      if (successCount > 0 && errorCount === 0) {
        messageText = `✅ Successfully updated all ${successCount} profiles!`;
        messageType = 'success';
        setCsvFile(null);
      } else if (successCount > 0 && errorCount > 0) {
        messageText = `⚠️ Partially successful: Updated ${successCount} profiles, ${errorCount} failed.\n\nFirst ${Math.min(5, errors.length)} errors:\n${errors.slice(0, 5).join('\n')}`;
        if (errors.length > 5) {
          messageText += `\n... and ${errors.length - 5} more errors. Check console for details.`;
        }
        messageType = 'error';
      } else {
        messageText = `❌ All ${errorCount} profile updates failed.\n\nFirst ${Math.min(5, errors.length)} errors:\n${errors.slice(0, 5).join('\n')}`;
        if (errors.length > 5) {
          messageText += `\n... and ${errors.length - 5} more errors. Check console for details.`;
        }
        messageType = 'error';
      }

      setMessage({ type: messageType, text: messageText });

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process CSV file' });
    } finally {
      setLoading(false);
    }
  };

  // Complete Slambook Upload Handlers
  const handleSlambookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlambookFile(file);
      setSlambookMessage(null);
    }
  };

  const handleSlambookUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slambookFile) return;

    setSlambookLoading(true);
    setSlambookMessage(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', slambookFile);

      const response = await fetch('/api/admin/upload-complete-slambook', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const profilesMatched = data.profiles?.matched || 0;
        const exactMatch = data.profiles?.exactMatch || 0;
        const nameOnlyMatch = data.profiles?.nameOnlyMatch || 0;
        const partialMatch = data.profiles?.partialMatch || 0;
        const unmatched = data.profiles?.unmatched || 0;
        const qaCreated = data.qaAnswers?.created || 0;
        const qaDeleted = data.qaAnswers?.deleted || 0;
        const matchRate = data.matchingDetails?.matchRate || '0%';

        let messageText = '✅ Upload Complete!\n\n';

        // Matching summary
        messageText += `📊 Matching Results (${matchRate} matched):\n`;
        if (exactMatch > 0) messageText += `  ✓ ${exactMatch} exact matches (100%)\n`;
        if (nameOnlyMatch > 0) messageText += `  ≈ ${nameOnlyMatch} name-only matches (90%)\n`;
        if (partialMatch > 0) messageText += `  ~ ${partialMatch} partial matches (75%)\n`;
        if (unmatched > 0) messageText += `  + ${unmatched} new profiles created\n`;
        messageText += '\n';

        // Q&A summary
        if (qaDeleted > 0) {
          messageText += `📝 Replaced ${qaDeleted} old Q&A answers with ${qaCreated} new answers\n`;
        } else {
          messageText += `📝 Added ${qaCreated} Q&A answers\n`;
        }

        // Warnings
        if (data.warnings && data.warnings.length > 0) {
          messageText += '\n⚠️ Warnings:\n';
          data.warnings.forEach((warning: string) => {
            messageText += `  • ${warning}\n`;
          });
        }

        // Details about unmatched profiles
        if (unmatched > 0 && data.matchingDetails?.unmatchedProfiles) {
          messageText += '\n❓ Unmatched Profiles (created as new):\n';
          data.matchingDetails.unmatchedProfiles.slice(0, 5).forEach((p: any) => {
            messageText += `  • ${p.name} (${p.year || 'no year'}) - ID ${p.newProfileId}\n`;
          });
          if (data.matchingDetails.unmatchedProfiles.length > 5) {
            messageText += `  ... and ${data.matchingDetails.unmatchedProfiles.length - 5} more\n`;
          }
        }

        setSlambookMessage({
          type: unmatched > 0 || partialMatch > 0 ? 'warning' as 'success' : 'success',
          text: messageText
        });
        setSlambookFile(null);
        // Refresh the page after a short delay
        setTimeout(() => router.refresh(), 3000);
      } else {
        setSlambookMessage({
          type: 'error',
          text: `❌ ${data.error || 'Upload failed'}${data.details ? ': ' + data.details : ''}`
        });
      }
    } catch (error) {
      setSlambookMessage({
        type: 'error',
        text: '❌ Network error during upload. Please try again.'
      });
    } finally {
      setSlambookLoading(false);
    }
  };

  // Bulk Image Upload Handlers
  const handleZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setZipFile(file);
      setImageMessage(null);
    }
  };

  const handleZipUpload = async () => {
    if (!zipFile) return;

    setImageLoading(true);
    setImageMessage(null);

    try {
      const formData = new FormData();
      formData.append('zipFile', zipFile);

      const response = await fetch('/api/admin/bulk-upload-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (data.mappings.length === 0) {
          setImageMessage({
            type: 'error',
            text: `No valid mappings found. ${data.errors.length} errors. Please check filenames.`
          });
        } else {
          setPreviewMappings(data.mappings);
          setIsPreviewOpen(true);
        }
      } else {
        setImageMessage({
          type: 'error',
          text: data.error || 'Failed to process ZIP file'
        });
      }
    } catch (error) {
      setImageMessage({
        type: 'error',
        text: 'Network error during ZIP upload'
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleApplyBulkImages = async () => {
    if (!zipFile || previewMappings.length === 0) return;

    setIsApplying(true);

    try {
      const formData = new FormData();
      formData.append('zipFile', zipFile);
      formData.append('mappings', JSON.stringify(previewMappings));

      const response = await fetch('/api/admin/apply-bulk-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const { summary, deletionWarnings } = data;

        let messageText = `Successfully updated ${summary.successful} profile${summary.successful !== 1 ? 's' : ''}!`;
        if (summary.failed > 0) {
          messageText += ` ${summary.failed} failed.`;
        }
        if (deletionWarnings.length > 0) {
          messageText += ` (${deletionWarnings.length} old images could not be deleted)`;
        }

        setImageMessage({
          type: summary.successful > 0 ? 'success' : 'error',
          text: messageText
        });

        // Reset state
        setZipFile(null);
        setPreviewMappings([]);
        setIsPreviewOpen(false);

        // Reset file input
        const fileInput = document.getElementById('zip-file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        // Revalidate directory page to show updated images
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paths: ['/directory'] })
          });
          console.log('✅ Directory page cache revalidated');
        } catch (revalidateError) {
          console.warn('⚠️ Failed to revalidate directory cache:', revalidateError);
          // Don't fail the operation if revalidation fails
        }

        // Force router refresh to clear all client-side cache
        router.refresh();

        // Show success dialog and offer to open directory
        // Increased delay to allow revalidation to complete
        setTimeout(() => {
          const openDirectory = window.confirm(
            `Successfully updated ${summary.successful} profile image${summary.successful !== 1 ? 's' : ''}!\n\n` +
            'The images have been uploaded to Supabase Storage.\n\n' +
            'Click OK to open the directory page in a new tab and see the updated images.'
          );

          if (openDirectory) {
            // Add timestamp to force fresh page load and bypass all caches
            const timestamp = Date.now();
            window.open(`/directory?refresh=${timestamp}`, '_blank');
            // Refresh current page too
            router.refresh();
          }
        }, 1500);
      } else {
        setImageMessage({
          type: 'error',
          text: data.error || 'Failed to apply bulk images'
        });
      }
    } catch (error) {
      setImageMessage({
        type: 'error',
        text: 'Network error during image upload'
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-2 border-neutral-200">
        <h2 className="text-2xl font-bold text-[#4E2E8C] tracking-tight">Import & Update Data</h2>
        <p className="text-neutral-600 text-sm mt-1">Manage profiles, images, and Q&A data in bulk</p>
      </div>

      {/* Info Box */}
      <div className="bg-[#4E2E8C]/10 border-2 border-[#4E2E8C] rounded-xl p-6 shadow-md">
        <p className="font-semibold mb-3 text-[#4E2E8C] text-base">📋 This tab contains:</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700">
          <li><strong className="text-[#4E2E8C]">Import Profiles & Q&A:</strong> Upload complete slambook CSV (creates/updates profiles with Q&A answers)</li>
          <li><strong className="text-[#4E2E8C]">Update Profile Data:</strong> Bulk update specific profile fields using CSV with IDs</li>
          <li><strong className="text-[#4E2E8C]">Bulk Image Upload:</strong> Upload profile pictures via ZIP file</li>
        </ul>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
        <p className="font-semibold mb-3 text-blue-800 text-base">🔄 Update Existing Profiles Only:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
          <li>Download template or export current profiles</li>
          <li>Edit the CSV file with new data (keep the "id" column!)</li>
          <li>Upload the modified CSV to update profiles in bulk</li>
        </ol>
        <div className="mt-4 pt-4 border-t-2 border-blue-200">
          <p className="text-sm text-blue-700">
            📝 <strong>Note:</strong> This updates profile data only (name, email, job, etc.).
            Profile pictures are preserved. To change images, use <strong>"Bulk Image Upload"</strong> below.
          </p>
        </div>
      </div>

      {/* Action Buttons - More Prominent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={handleExportProfiles}
          disabled={exportLoading}
          className="group relative bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] disabled:opacity-50 text-white px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {exportLoading ? (
            <span className="relative z-10">Exporting...</span>
          ) : (
            <>
              <span className="text-xl relative z-10">📥</span>
              <span className="relative z-10">Download Template</span>
            </>
          )}
        </button>
        <button
          onClick={downloadBulkUpdateTemplate}
          className="group relative bg-gradient-to-r from-brand-yellow to-accent-400 text-[#4E2E8C] px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-xl relative z-10">📋</span>
          <span className="relative z-10">Download Template</span>
        </button>
        <button
          onClick={exportProfileIds}
          className="group relative backdrop-blur-md bg-white/80 hover:bg-white text-[#4E2E8C] border-2 border-[#4E2E8C] px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
        >
          <span className="text-xl relative z-10">🆔</span>
          <span className="relative z-10">Export Profile IDs</span>
        </button>
      </div>

      {/* Import Profiles & Q&A Section */}
      <div className="border-t-2 border-neutral-200 pt-8">
        <h3 className="text-2xl font-bold text-[#4E2E8C] mb-6">📥 Import Profiles & Q&A (CSV Upload)</h3>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 shadow-md mb-6">
          <p className="font-semibold mb-3 text-green-800 text-base">✨ Smart Single-File Upload:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
            <li>Upload your original slambook CSV file (17 columns: 7 profile fields + 10 Q&A answers)</li>
            <li>System automatically <strong>matches existing profiles by name + graduation year</strong></li>
            <li>Updates existing profiles or creates new ones as needed</li>
            <li>Q&A answers are refreshed (old answers replaced with new ones)</li>
          </ol>
          <div className="mt-4 pt-4 border-t-2 border-green-200">
            <p className="text-sm text-green-700">
              ℹ️ <strong>Expected format:</strong> S.No, Full Name, Nickname, Address, Job, Tenure, Company, + 10 Q&A columns
            </p>
            <p className="text-sm text-green-700 mt-2">
              🔍 <strong>Matching:</strong> Profiles are matched by normalized name (case-insensitive, whitespace-tolerant) + year graduated
            </p>
          </div>
        </div>

        <form onSubmit={handleSlambookUpload} className="space-y-4">
          <div>
            <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Upload Profiles & Q&A CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleSlambookFileChange}
              className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#4E2E8C] file:text-white file:cursor-pointer hover:file:bg-primary-700 shadow-sm transition-all"
            />
            {slambookFile && <p className="text-neutral-600 mt-2 text-sm">Selected: {slambookFile.name}</p>}
          </div>

          {slambookMessage && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border-2 shadow-sm ${
                slambookMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : slambookMessage.type === 'warning'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {slambookMessage.type === 'success' ? (
                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              ) : slambookMessage.type === 'warning' ? (
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              )}
              <span className="whitespace-pre-line text-sm leading-relaxed flex-1">{slambookMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={slambookLoading || !slambookFile}
            className="group relative w-full bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {slambookLoading ? (
              <>
                <RefreshCw className="animate-spin relative z-10" size={22} />
                <span className="relative z-10">Processing CSV...</span>
              </>
            ) : (
              <>
                <Upload size={22} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Upload & Process Slambook CSV</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="border-t-2 border-neutral-200 pt-8">
        <h3 className="text-2xl font-bold text-[#4E2E8C] mb-6">✏️ Update Existing Profiles</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Upload Updated CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-yellow file:text-[#4E2E8C] file:cursor-pointer hover:file:bg-accent-400 shadow-sm transition-all"
            />
            {csvFile && <p className="text-neutral-600 mt-2 text-sm">Selected: {csvFile.name}</p>}
          </div>

          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !csvFile}
            className="group relative w-full bg-gradient-to-r from-brand-yellow to-accent-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#4E2E8C] px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {loading ? (
              <>
                <RefreshCw className="animate-spin relative z-10" size={22} />
                <span className="relative z-10">Updating Profiles...</span>
              </>
            ) : (
              <>
                <Upload size={22} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Update Profiles from CSV</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bulk Image Upload Section */}
      <div className="border-t-2 border-neutral-200 pt-8">
        <h3 className="text-2xl font-bold text-[#4E2E8C] mb-6">📸 Bulk Image Upload</h3>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold mb-3 text-yellow-800 text-base">How to upload profile images in bulk:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                <li>Prepare images with filenames as profile IDs (e.g., 123.jpg, 456.png)</li>
                <li>Create a ZIP file containing all profile images</li>
                <li>Upload the ZIP file and preview the mappings</li>
                <li>Confirm to upload and update all profiles at once</li>
              </ol>
              <p className="text-sm mt-4 text-yellow-700 font-medium">
                💡 Supported formats: JPG, PNG, WEBP | Max size: 5MB per image |
                Filenames: {'{'}id{'}'}. jpg (e.g., 123.jpg or 123-john-doe.png)
              </p>
            </div>
            <button
              onClick={downloadImageGuide}
              className="ml-4 bg-brand-yellow hover:bg-accent-400 text-[#4E2E8C] px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shadow-sm hover:shadow-md"
            >
              📖 Full Guide
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Upload ZIP File with Images</label>
            <input
              id="zip-file-input"
              type="file"
              accept=".zip"
              onChange={handleZipFileChange}
              disabled={imageLoading}
              className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#4E2E8C] file:text-white file:cursor-pointer hover:file:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
            />
            {zipFile && (
              <p className="text-neutral-600 mt-2 text-sm">
                Selected: {zipFile.name} ({(zipFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {imageMessage && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-sm ${
                imageMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {imageMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm">{imageMessage.text}</span>
            </div>
          )}

          <button
            onClick={handleZipUpload}
            disabled={imageLoading || !zipFile}
            className="group relative w-full bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {imageLoading ? (
              <>
                <RefreshCw className="animate-spin relative z-10" size={22} />
                <span className="relative z-10">Processing ZIP File...</span>
              </>
            ) : (
              <>
                <Upload size={22} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Preview Image Mappings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <BulkImagePreviewModal
        mappings={previewMappings}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirm={handleApplyBulkImages}
        isApplying={isApplying}
      />
    </div>
  );
}

// Single Profile Upload Form (EXISTING - for creating new profiles)
function SingleProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    year_graduated: '',
    current_job: '',
    company: '',
    bio: '',
    linkedin_url: '',
    nicknames: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('/api/admin/upload-profile', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Profile created successfully! Profile ID: ${result.profile.id}` });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          year_graduated: '',
          current_job: '',
          company: '',
          bio: '',
          linkedin_url: '',
          nicknames: '',
        });
        setImageFile(null);
        setImagePreview('');
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#4E2E8C] mb-6">Create New Profile</h2>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="block text-[#4E2E8C] font-semibold text-sm">Profile Image</label>
        <div className="flex items-center gap-5">
          {imagePreview && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-[#4E2E8C] bg-neutral-100 shadow-md">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
            </div>
          )}
          <label className="cursor-pointer bg-brand-yellow hover:bg-accent-400 text-[#4E2E8C] px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
            <Upload size={20} />
            Choose Image
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Full Name <span className="text-red-600">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="+1234567890"
          />
        </div>

        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="New York, USA"
          />
        </div>

        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Year Graduated</label>
          <input
            type="text"
            name="year_graduated"
            value={formData.year_graduated}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="2010"
          />
        </div>

        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Current Job</label>
          <input
            type="text"
            name="current_job"
            value={formData.current_job}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="Tech Corp"
          />
        </div>

        <div>
          <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Nicknames</label>
          <input
            type="text"
            name="nicknames"
            value={formData.nicknames}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
            placeholder="Johnny, JD"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">LinkedIn URL</label>
        <input
          type="url"
          name="linkedin_url"
          value={formData.linkedin_url}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm transition-all shadow-sm"
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label className="block text-[#4E2E8C] font-semibold mb-2 text-sm">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-white text-[#4E2E8C] placeholder-neutral-400 border-2 border-neutral-200 focus:border-[#4E2E8C] focus:ring-2 focus:ring-[#4E2E8C]/20 focus:outline-none text-sm resize-none transition-all shadow-sm"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full bg-gradient-to-r from-[#4E2E8C] to-[#6D28D9] disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative z-10">{loading ? 'Creating...' : 'Create Profile'}</span>
      </button>
    </form>
  );
}

