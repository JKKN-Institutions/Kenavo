'use client';

import React, { useState, useEffect } from 'react';
import { Upload, UserPlus, CheckCircle, AlertCircle, Edit2, Search, X, Save, List, LogOut, Image as ImageIcon, RefreshCw, Mail, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/client';
import BulkImagePreviewModal, { ImageMapping } from '@/components/admin/BulkImagePreviewModal';
import GalleryManagementTab from '@/components/admin/GalleryManagementTab';
import ContactSubmissionsTab from '@/components/ContactSubmissionsTab';
import UserManagementTab from '@/components/admin/UserManagementTab';

type TabType = 'manage' | 'bulkUpdate' | 'single' | 'gallery' | 'contact' | 'users';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-purple-300 mx-auto mb-4" />
          <p className="text-white text-lg">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Kenavo Admin Panel</h1>
              <p className="text-purple-200">Streamlined workflow: Import → Manage → Update</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold transition-all disabled:cursor-not-allowed"
            >
              <LogOut size={20} />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'manage'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <List size={20} />
            Manage Profiles
          </button>
          <button
            onClick={() => setActiveTab('bulkUpdate')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'bulkUpdate'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Upload size={20} />
            Import & Update
          </button>
          <button
            onClick={() => setActiveTab('single')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'single'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <UserPlus size={20} />
            Create Profile
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ImageIcon size={20} />
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'contact'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Mail size={20} />
            Contact Forms
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Users size={20} />
            Users
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {activeTab === 'manage' && <ManageProfilesTab />}
          {activeTab === 'bulkUpdate' && <BulkUpdateTab />}
          {activeTab === 'single' && <SingleProfileForm />}
          {activeTab === 'gallery' && <GalleryManagementTab />}
          {activeTab === 'contact' && <ContactSubmissionsTab />}
          {activeTab === 'users' && <UserManagementTab />}
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
      <h2 className="text-2xl font-bold text-white mb-4">Manage Profiles ({totalCount} Total)</h2>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              placeholder="Search by name, location, or designation/organisation..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            />
          </div>
        </div>
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-white focus:outline-none"
        >
          <option value="">All Years</option>
          <option value="2005">2005</option>
          <option value="2006">2006</option>
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
        </select>
        <button
          onClick={fetchProfiles}
          className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Profile List */}
      {loading ? (
        <div className="text-white text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p>Loading fresh profile data...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-white text-center py-10">No profiles found</div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/15 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[rgba(147,51,234,0.2)] flex-shrink-0">
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
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{profile.name}</h3>
                  <p className="text-purple-200 text-sm">
                    {profile.year_graduated && `Class of ${profile.year_graduated}`}
                    {profile.location && ` • ${profile.location}`}
                    {profile.designation_organisation && ` • ${profile.designation_organisation}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEdit(profile)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all"
          >
            Next
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile: {profile.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-white font-semibold">Profile Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 bg-[rgba(147,51,234,0.2)]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
                </div>
              )}
              <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                <Upload size={20} />
                {imageFile ? 'Change Image' : 'Upload New Image'}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Year Graduated</label>
              <input
                type="text"
                name="year_graduated"
                value={formData.year_graduated}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Current Job</label>
              <input
                type="text"
                name="current_job"
                value={formData.current_job}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Nicknames</label>
              <input
                type="text"
                name="nicknames"
                value={formData.nicknames}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            />
          </div>

          {/* Q&A Section */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Q&A Answers</h3>
            {loadingQA ? (
              <div className="text-white">Loading questions...</div>
            ) : (
              <div className="space-y-4">
                {allQuestions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-white font-semibold mb-2">{question.question_text}</label>
                    <textarea
                      value={getAnswer(question.id)}
                      onChange={(e) => handleQAChange(question.id, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
                      placeholder="Enter answer..."
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Updating...' : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all"
            >
              Cancel
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Import & Update Data</h2>

      <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 text-purple-100">
        <p className="font-semibold mb-2">📋 This tab contains:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Import Profiles & Q&A:</strong> Upload complete slambook CSV (creates/updates profiles with Q&A answers)</li>
          <li><strong>Update Profile Data:</strong> Bulk update specific profile fields using CSV with IDs</li>
          <li><strong>Bulk Image Upload:</strong> Upload profile pictures via ZIP file</li>
        </ul>
      </div>

      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100">
        <p className="font-semibold mb-2">🔄 Update Existing Profiles Only:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Download template or export current profiles</li>
          <li>Edit the CSV file with new data (keep the "id" column!)</li>
          <li>Upload the modified CSV to update profiles in bulk</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-blue-500/30">
          <p className="text-xs text-blue-200">
            📝 <strong>Note:</strong> This updates profile data only (name, email, job, etc.).
            Profile pictures are preserved. To change images, use <strong>"Bulk Image Upload"</strong> below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={handleExportProfiles}
          disabled={exportLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          {exportLoading ? 'Exporting...' : '📥 Export All Profiles'}
        </button>
        <button
          onClick={downloadBulkUpdateTemplate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          📋 Download Template
        </button>
        <button
          onClick={exportProfileIds}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          🆔 Export Profile IDs
        </button>
      </div>

      {/* Import Profiles & Q&A Section */}
      <div className="border-t border-white/20 pt-6 mt-6">
        <h3 className="text-xl font-bold text-white mb-4">📥 Import Profiles & Q&A (CSV Upload)</h3>

        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-100 mb-6">
          <p className="font-semibold mb-2">✨ Smart Single-File Upload:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Upload your original slambook CSV file (17 columns: 7 profile fields + 10 Q&A answers)</li>
            <li>System automatically <strong>matches existing profiles by name + graduation year</strong></li>
            <li>Updates existing profiles or creates new ones as needed</li>
            <li>Q&A answers are refreshed (old answers replaced with new ones)</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-green-500/30">
            <p className="text-xs text-green-200">
              ℹ️ <strong>Expected format:</strong> S.No, Full Name, Nickname, Address, Job, Tenure, Company, + 10 Q&A columns
            </p>
            <p className="text-xs text-green-200 mt-1">
              🔍 <strong>Matching:</strong> Profiles are matched by normalized name (case-insensitive, whitespace-tolerant) + year graduated
            </p>
          </div>
        </div>

        <form onSubmit={handleSlambookUpload} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Upload Profiles & Q&A CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleSlambookFileChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:cursor-pointer hover:file:bg-green-700"
            />
            {slambookFile && <p className="text-white/70 mt-2">Selected: {slambookFile.name}</p>}
          </div>

          {slambookMessage && (
            <div
              className={`flex items-start gap-2 p-4 rounded-lg ${
                slambookMessage.type === 'success'
                  ? 'bg-green-500/20 text-green-100'
                  : slambookMessage.type === 'warning'
                  ? 'bg-yellow-500/20 text-yellow-100'
                  : 'bg-red-500/20 text-red-100'
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
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {slambookLoading ? 'Processing...' : (
              <>
                <Upload size={20} />
                Upload & Process Slambook CSV
              </>
            )}
          </button>
        </form>
      </div>

      <div className="border-t border-white/20 pt-6 mt-6">
        <h3 className="text-xl font-bold text-white mb-4">✏️ Update Existing Profiles</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Upload Updated CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700"
            />
            {csvFile && <p className="text-white/70 mt-2">Selected: {csvFile.name}</p>}
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !csvFile}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Updating...' : (
              <>
                <Upload size={20} />
                Update Profiles from CSV
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bulk Image Upload Section */}
      <div className="border-t border-white/20 pt-6 mt-6">
        <h3 className="text-xl font-bold text-white mb-4">📸 Bulk Image Upload</h3>

        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-100 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold mb-2">How to upload profile images in bulk:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Prepare images with filenames as profile IDs (e.g., 123.jpg, 456.png)</li>
                <li>Create a ZIP file containing all profile images</li>
                <li>Upload the ZIP file and preview the mappings</li>
                <li>Confirm to upload and update all profiles at once</li>
              </ol>
              <p className="text-xs mt-3 text-yellow-200">
                💡 Supported formats: JPG, PNG, WEBP | Max size: 5MB per image |
                Filenames: {'{'}id{'}'}. jpg (e.g., 123.jpg or 123-john-doe.png)
              </p>
            </div>
            <button
              onClick={downloadImageGuide}
              className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
            >
              📖 Full Guide
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Upload ZIP File with Images</label>
            <input
              id="zip-file-input"
              type="file"
              accept=".zip"
              onChange={handleZipFileChange}
              disabled={imageLoading}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {zipFile && (
              <p className="text-white/70 mt-2">
                Selected: {zipFile.name} ({(zipFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {imageMessage && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                imageMessage.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
              }`}
            >
              {imageMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{imageMessage.text}</span>
            </div>
          )}

          <button
            onClick={handleZipUpload}
            disabled={imageLoading || !zipFile}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {imageLoading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Processing ZIP...
              </>
            ) : (
              <>
                <Upload size={20} />
                Preview Image Mappings
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
      <h2 className="text-2xl font-bold text-white mb-4">Create New Profile</h2>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-white font-semibold">Profile Image</label>
        <div className="flex items-center gap-4">
          {imagePreview && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 bg-[rgba(147,51,234,0.2)]">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
            </div>
          )}
          <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
            <Upload size={20} />
            Choose Image
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="+1234567890"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="New York, USA"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Year Graduated</label>
          <input
            type="text"
            name="year_graduated"
            value={formData.year_graduated}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="2010"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Current Job</label>
          <input
            type="text"
            name="current_job"
            value={formData.current_job}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="Tech Corp"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Nicknames</label>
          <input
            type="text"
            name="nicknames"
            value={formData.nicknames}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
            placeholder="Johnny, JD"
          />
        </div>
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">LinkedIn URL</label>
        <input
          type="url"
          name="linkedin_url"
          value={formData.linkedin_url}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
      >
        {loading ? 'Creating...' : 'Create Profile'}
      </button>
    </form>
  );
}

