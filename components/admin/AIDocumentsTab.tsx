'use client';

import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Loader2, Sparkles, Tag, FolderOpen } from 'lucide-react';
import type { GeminiDocument, DocumentCategory } from '@/lib/types/database';

export default function AIDocumentsTab() {
  const [documents, setDocuments] = useState<GeminiDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Upload form state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('knowledge_base');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [categoryFilter, statusFilter]);

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams({
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        limit: '50',
      });

      const response = await fetch(`/api/admin/gemini/documents?${params}`);
      const data = await response.json();

      if (response.ok) {
        setDocuments(data.documents);
      } else {
        console.error('Error fetching documents:', data.error);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!displayName) {
        setDisplayName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    if (!displayName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a display name' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('displayName', displayName);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('description', description);

      const response = await fetch('/api/admin/gemini/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Document upload started!' });
        setUploadModalOpen(false);
        resetForm();
        fetchDocuments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSyncAlumni = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/gemini/sync-alumni', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Alumni sync started! ${data.profileCount} profiles will be uploaded.`,
        });
        fetchDocuments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Sync failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Sync failed. Please try again.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gemini/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Document deleted successfully' });
        fetchDocuments();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Delete failed. Please try again.' });
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDisplayName('');
    setCategory('knowledge_base');
    setTags('');
    setDescription('');
    setMessage(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
            <CheckCircle size={14} />
            Completed
          </span>
        );
      case 'uploading':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
            <Loader2 size={14} className="animate-spin" />
            Uploading
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300">
            <XCircle size={14} />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300">
            <Clock size={14} />
            Pending
          </span>
        );
    }
  };

  const getCategoryBadge = (cat: string) => {
    const colors: Record<string, string> = {
      alumni_profiles: 'bg-purple-500/20 text-purple-300',
      knowledge_base: 'bg-blue-500/20 text-blue-300',
      events: 'bg-green-500/20 text-green-300',
      newsletters: 'bg-yellow-500/20 text-yellow-300',
      resources: 'bg-pink-500/20 text-pink-300',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors[cat] || 'bg-gray-500/20 text-gray-300'}`}>
        <FolderOpen size={14} />
        {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles size={28} />
          AI Documents
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleSyncAlumni}
            disabled={syncing}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
          >
            {syncing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Sync Alumni
              </>
            )}
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
          >
            <Upload size={20} />
            Upload Document
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/50 focus:outline-none"
          >
            <option value="all" className="bg-purple-900">All Categories</option>
            <option value="alumni_profiles" className="bg-purple-900">Alumni Profiles</option>
            <option value="knowledge_base" className="bg-purple-900">Knowledge Base</option>
            <option value="events" className="bg-purple-900">Events</option>
            <option value="newsletters" className="bg-purple-900">Newsletters</option>
            <option value="resources" className="bg-purple-900">Resources</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/50 focus:outline-none"
          >
            <option value="all" className="bg-purple-900">All Status</option>
            <option value="completed" className="bg-purple-900">Completed</option>
            <option value="uploading" className="bg-purple-900">Uploading</option>
            <option value="pending" className="bg-purple-900">Pending</option>
            <option value="failed" className="bg-purple-900">Failed</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => fetchDocuments()}
            className="w-full text-white/70 hover:text-white px-4 py-3 rounded-lg border border-white/20 hover:border-white/50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 size={48} className="mx-auto animate-spin text-white/50" />
          <p className="text-white/70 mt-4">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <FileText size={48} className="mx-auto text-white/30 mb-4" />
          <p className="text-white/70 text-lg">No documents found</p>
          <p className="text-white/50 text-sm mt-2">Upload your first document to get started</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Document</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Category</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Uploaded</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">
                      <div>
                        <div className="font-semibold">{doc.display_name}</div>
                        <div className="text-sm text-white/50">{doc.file_name}</div>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {doc.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white/10 text-white/70"
                              >
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{getCategoryBadge(doc.category)}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(doc.upload_status)}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">
                      {new Date(doc.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-400 hover:text-red-300 transition-all p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete document"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Upload Document</h3>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  resetForm();
                }}
                className="text-white hover:text-red-400 transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">File *</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.txt,.doc,.docx,.csv"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Display Name *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
                  placeholder="My Document"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-white focus:outline-none"
                >
                  <option value="knowledge_base" className="bg-purple-900">Knowledge Base</option>
                  <option value="events" className="bg-purple-900">Events</option>
                  <option value="newsletters" className="bg-purple-900">Newsletters</option>
                  <option value="resources" className="bg-purple-900">Resources</option>
                  <option value="alumni_profiles" className="bg-purple-900">Alumni Profiles</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
                  placeholder="handbook, 2024, policies"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white focus:outline-none"
                  placeholder="Brief description of the document..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
