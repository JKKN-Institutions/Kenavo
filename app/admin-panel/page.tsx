'use client';

import React, { useState, useEffect } from 'react';
import { Upload, UserPlus, FileSpreadsheet, CheckCircle, AlertCircle, Edit2, Search, RefreshCw, X, Save, List, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/client';
import BulkImagePreviewModal, { ImageMapping } from '@/components/admin/BulkImagePreviewModal';

type TabType = 'manage' | 'bulkUpdate' | 'single' | 'bulk' | 'qa';

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
  const [activeTab, setActiveTab] = useState<TabType>('manage');
  const [loggingOut, setLoggingOut] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Kenavo Admin Panel</h1>
              <p className="text-purple-200">Manage alumni profiles, images, and Q&A data</p>
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
            <RefreshCw size={20} />
            Bulk Update
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
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'bulk'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileSpreadsheet size={20} />
            Bulk Create
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'qa'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Upload size={20} />
            Q&A Upload
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {activeTab === 'manage' && <ManageProfilesTab />}
          {activeTab === 'bulkUpdate' && <BulkUpdateTab />}
          {activeTab === 'single' && <SingleProfileForm />}
          {activeTab === 'bulk' && <BulkUploadForm />}
          {activeTab === 'qa' && <QAUploadForm />}
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
      });

      const response = await fetch(`/api/admin/list-profiles?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProfiles(data.profiles);
        setTotalPages(data.totalPages);
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

  const handleCloseEdit = () => {
    setEditingProfile(null);
    fetchProfiles(); // Refresh list after edit
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Manage Profiles (134 Total)</h2>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              placeholder="Search by name, location, or company..."
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
        <div className="text-white text-center py-10">Loading profiles...</div>
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
                <img
                  src={profile.profile_image_url || '/placeholder-profile.png'}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-profile.png';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{profile.name}</h3>
                  <p className="text-purple-200 text-sm">
                    {profile.year_graduated && `Class of ${profile.year_graduated}`}
                    {profile.location && ` • ${profile.location}`}
                    {profile.company && ` • ${profile.company}`}
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
      const response = await fetch(`/api/admin/get-profile/${profile.id}`);
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
        onClose();
      }, 2000);

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
                <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-white/20" />
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
  const [exportLoading, setExportLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        const headers = ['id', 'name', 'email', 'phone', 'location', 'year_graduated', 'current_job', 'company', 'bio', 'linkedin_url', 'nicknames', 'profile_image_url'];
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

          const formData = new FormData();
          Object.entries(row).forEach(([key, value]) => {
            if (key !== 'id' && value) {
              formData.append(key, value as string);
            }
          });
          formData.append('existing_image_url', row.profile_image_url || '');

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
      <h2 className="text-2xl font-bold text-white mb-4">Bulk Update Profiles</h2>

      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100">
        <p className="font-semibold mb-2">How to bulk update:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Download template or export current profiles</li>
          <li>Edit the CSV file with new data (keep the "id" column!)</li>
          <li>Upload the modified CSV to update profiles in bulk</li>
        </ol>
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

      <div className="border-t border-white/20 pt-6">
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
            <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-white/20" />
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

// Bulk Upload Form (EXISTING - unchanged)
function BulkUploadForm() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

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
      const formData = new FormData();
      formData.append('file', csvFile);

      const response = await fetch('/api/admin/bulk-upload-profiles', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `✅ Successfully created ${result.count} profile${result.count !== 1 ? 's' : ''}! Next: Go to "Q&A Upload" tab to add answers for these profiles.`
        });
        setCsvFile(null);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload profiles' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Link to static template file instead of generating inline
    const a = document.createElement('a');
    a.href = '/templates/profiles_template.csv';
    a.download = 'profiles_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Bulk Create Profiles</h2>

      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-100">
        <p className="font-semibold mb-2">CSV Format Instructions:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Required column: <code className="bg-black/30 px-2 py-1 rounded">name</code></li>
          <li>Optional columns: email, phone, location, year_graduated, current_job, company, bio, linkedin_url, nicknames, profile_image_url</li>
          <li>Use direct URLs for profile_image_url (must be publicly accessible)</li>
        </ul>
      </div>

      {/* Workflow Guide - Expandable */}
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-white hover:bg-green-500/30 transition-colors"
        >
          <span className="font-semibold">💡 Need Help? View Step-by-Step Workflow</span>
          <span className="text-2xl">{showHelp ? '−' : '+'}</span>
        </button>
        {showHelp && (
          <div className="p-4 bg-green-900/30 text-green-100">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">📋 Step-by-Step Workflow:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li><strong>Download Template:</strong> Click "Download CSV Template" button below</li>
                  <li><strong>Open in Spreadsheet:</strong> Use Excel, Google Sheets, or any CSV editor</li>
                  <li><strong>Fill Data:</strong> Add one profile per row (name is required, rest optional)</li>
                  <li><strong>Save as CSV:</strong> Export/save your file as .csv format</li>
                  <li><strong>Upload:</strong> Use the upload button below to import</li>
                  <li><strong>Add Q&A (Optional):</strong> After creation, go to "Q&A Upload" tab to add answers</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💼 Field Format Guidelines:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>name:</strong> Full name (e.g., "John Doe")</li>
                  <li><strong>email:</strong> Valid email address</li>
                  <li><strong>phone:</strong> Include country code (e.g., "+1-555-0123")</li>
                  <li><strong>year_graduated:</strong> 4-digit year (e.g., "2010")</li>
                  <li><strong>linkedin_url:</strong> Full URL starting with https://</li>
                  <li><strong>profile_image_url:</strong> Public image URL (or upload images later via Bulk Update → Bulk Image Upload)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚠️ Common Mistakes to Avoid:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-yellow-200">
                  <li>Don't modify the header row (first row with column names)</li>
                  <li>Don't leave name column empty</li>
                  <li>Use commas only within quoted fields</li>
                  <li>Save as CSV, not Excel (.xlsx)</li>
                  <li>Q&A answers must be added separately after profile creation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={downloadTemplate}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
      >
        📥 Download CSV Template
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Upload CSV File</label>
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
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
        >
          {loading ? 'Uploading...' : 'Upload Profiles'}
        </button>
      </form>
    </div>
  );
}

// Q&A Upload Form (EXISTING - unchanged)
function QAUploadForm() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  // The 10 standard questions
  const questions = [
    { id: 1, text: "A school memory that still makes you smile" },
    { id: 2, text: "Your favourite spot in school" },
    { id: 3, text: "If you get one full day in school today, what would you do..." },
    { id: 4, text: "What advice would you give to the younger students entering the workforce today:" },
    { id: 5, text: "A book / movie / experience that changed your perspective of life:" },
    { id: 6, text: "A personal achievement that means a lot to you:" },
    { id: 7, text: "Your favourite hobby that you pursue when off work:" },
    { id: 8, text: "Your favourite go-to song(s) to enliven your spirits" },
    { id: 9, text: "What does reconnecting with this alumini group mean to you at this stage of your life?" },
    { id: 10, text: "Would you be open to mentoring younger students or collaborating with alumni?" }
  ];

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
      const formData = new FormData();
      formData.append('file', csvFile);

      const response = await fetch('/api/admin/upload-qa-answers', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `✅ Successfully uploaded ${result.count} Q&A answer${result.count !== 1 ? 's' : ''}! View profiles in "Manage Profiles" tab to see the answers.`
        });
        setCsvFile(null);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload Q&A answers' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Link to static template file instead of generating inline
    const a = document.createElement('a');
    a.href = '/templates/qa_answers_template.csv';
    a.download = 'qa_answers_template.csv';
    a.click();
  };

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Upload Q&A Answers</h2>

      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100">
        <p className="font-semibold mb-2">CSV Format Instructions:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Required columns: <code className="bg-black/30 px-2 py-1 rounded">profile_id</code>, <code className="bg-black/30 px-2 py-1 rounded">question_id</code>, <code className="bg-black/30 px-2 py-1 rounded">answer</code></li>
          <li>profile_id must match existing profile IDs</li>
          <li>question_id: 1-10 (the 10 standard questions below)</li>
        </ul>
      </div>

      {/* Questions Reference */}
      <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-white hover:bg-purple-500/30 transition-colors"
        >
          <span className="font-semibold">📋 View All 10 Questions & Their IDs</span>
          <span className="text-2xl">{showQuestions ? '−' : '+'}</span>
        </button>
        {showQuestions && (
          <div className="p-4 bg-purple-900/30">
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="flex gap-3 text-sm">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold min-w-[3rem] text-center">
                    ID: {q.id}
                  </span>
                  <span className="text-purple-100 flex-1">{q.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={downloadTemplate}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          📥 Download CSV Template
        </button>
        <button
          onClick={exportProfileIds}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          🆔 Export Profile IDs
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Upload CSV File</label>
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
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
        >
          {loading ? 'Uploading...' : 'Upload Q&A Answers'}
        </button>
      </form>
    </div>
  );
}
