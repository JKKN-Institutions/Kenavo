'use client';

import React, { useState, useEffect } from 'react';
import { Upload, UserPlus, FileSpreadsheet, CheckCircle, AlertCircle, Edit2, Search, RefreshCw, X, Save, List } from 'lucide-react';

type TabType = 'manage' | 'bulkUpdate' | 'single' | 'bulk' | 'qa';

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
  const [activeTab, setActiveTab] = useState<TabType>('manage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2">Kenavo Admin Panel</h1>
          <p className="text-purple-200">Manage alumni profiles, images, and Q&A data</p>
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
                {profile.profile_image_url && (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
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
      const headers = lines[0].split(',').map(h => h.trim());

      // Must have ID column for updates
      if (!headers.includes('id')) {
        setMessage({ type: 'error', text: 'CSV must contain "id" column for updates' });
        setLoading(false);
        return;
      }

      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: any = {};
        headers.forEach((h, i) => {
          row[h] = values[i] || null;
        });
        return row;
      });

      // Update each profile
      let successCount = 0;
      let errorCount = 0;

      for (const row of rows) {
        if (!row.id) continue;

        try {
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
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      setMessage({
        type: successCount > 0 ? 'success' : 'error',
        text: `Updated ${successCount} profiles successfully. ${errorCount > 0 ? `Failed: ${errorCount}` : ''}`
      });
      setCsvFile(null);

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process CSV file' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Bulk Update Profiles</h2>

      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100">
        <p className="font-semibold mb-2">How to bulk update:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Export All Profiles" to download current data as CSV</li>
          <li>Edit the CSV file with new data (keep the "id" column!)</li>
          <li>Upload the modified CSV to update profiles in bulk</li>
        </ol>
      </div>

      <button
        onClick={handleExportProfiles}
        disabled={exportLoading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
      >
        {exportLoading ? 'Exporting...' : '⬇️ Export All Profiles to CSV'}
      </button>

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
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
          >
            {loading ? 'Updating...' : '⬆️ Update Profiles from CSV'}
          </button>
        </form>
      </div>
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
        setMessage({ type: 'success', text: `Successfully uploaded ${result.count} profiles!` });
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
    const template = `name,email,phone,location,year_graduated,current_job,company,bio,linkedin_url,nicknames,profile_image_url
John Doe,john@example.com,+1234567890,New York USA,2010,Software Engineer,Tech Corp,Bio text here,https://linkedin.com/in/johndoe,Johnny,https://example.com/image.jpg`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
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

      <button
        onClick={downloadTemplate}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
      >
        Download CSV Template
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
        setMessage({ type: 'success', text: `Successfully uploaded ${result.count} Q&A answers!` });
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
    const template = `profile_id,question_id,answer
1,1,Playing cricket with friends during lunch break
1,2,The library - it was my peaceful corner
2,1,Annual day celebrations were always memorable`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qa_answers_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Upload Q&A Answers</h2>

      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-100">
        <p className="font-semibold mb-2">CSV Format Instructions:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Required columns: <code className="bg-black/30 px-2 py-1 rounded">profile_id</code>, <code className="bg-black/30 px-2 py-1 rounded">question_id</code>, <code className="bg-black/30 px-2 py-1 rounded">answer</code></li>
          <li>profile_id must match existing profile IDs</li>
          <li>question_id: 1-10 (the 10 standard questions)</li>
        </ul>
      </div>

      <button
        onClick={downloadTemplate}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
      >
        Download CSV Template
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
          {loading ? 'Uploading...' : 'Upload Q&A Answers'}
        </button>
      </form>
    </div>
  );
}
