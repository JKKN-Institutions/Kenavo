'use client';

import { useState, useEffect } from 'react';
import { ContactSubmission } from '@/lib/types/contact';
import { Mail, Search, Download, Eye, Trash2, Check } from 'lucide-react';

export default function ContactSubmissionsTab() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [page, statusFilter, searchTerm]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        status: statusFilter,
        ...(searchTerm && { search: searchTerm }),
        _t: Date.now().toString(),
      });

      const response = await fetch(`/api/admin/contact/list?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: status as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500/20 text-red-300';
      case 'read': return 'bg-blue-500/20 text-blue-300';
      case 'replied': return 'bg-green-500/20 text-green-300';
      case 'archived': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Contact Form Submissions ({totalCount} Total)
      </h2>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[rgba(217,81,100,1)]"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[rgba(217,81,100,1)]"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="text-center py-8 text-white">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-8 text-white/70">No submissions found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/20">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-white font-medium">Name</th>
                <th className="px-4 py-3 text-left text-white font-medium">Email</th>
                <th className="px-4 py-3 text-left text-white font-medium">Date</th>
                <th className="px-4 py-3 text-left text-white font-medium">Status</th>
                <th className="px-4 py-3 text-left text-white font-medium">Files</th>
                <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{submission.full_name}</td>
                  <td className="px-4 py-3 text-white">{submission.email}</td>
                  <td className="px-4 py-3 text-white/70">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {submission.files.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="p-1 hover:bg-white/10 rounded"
                        title="View"
                      >
                        <Eye size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => deleteSubmission(submission.id)}
                        className="p-1 hover:bg-white/10 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/10 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white/10 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-[rgba(78,46,140,1)] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Submission Details</h3>
              <button onClick={() => setSelectedSubmission(null)} className="text-white hover:text-red-400">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm">Name:</label>
                <p className="text-white">{selectedSubmission.full_name}</p>
              </div>

              <div>
                <label className="text-white/70 text-sm">Email:</label>
                <p className="text-white">{selectedSubmission.email}</p>
              </div>

              <div>
                <label className="text-white/70 text-sm">Date:</label>
                <p className="text-white">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
              </div>

              <div>
                <label className="text-white/70 text-sm">Message:</label>
                <p className="text-white whitespace-pre-wrap bg-white/5 p-4 rounded">{selectedSubmission.message}</p>
              </div>

              {selectedSubmission.files.length > 0 && (
                <div>
                  <label className="text-white/70 text-sm">Attachments ({selectedSubmission.files.length}):</label>
                  <div className="space-y-2 mt-2">
                    {selectedSubmission.files.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-white">{file.name}</span>
                        <a href={file.url} download className="text-[rgba(217,81,100,1)] hover:underline">
                          <Download size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-white/70 text-sm">Status:</label>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => updateStatus(selectedSubmission.id, e.target.value)}
                  className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => updateStatus(selectedSubmission.id, 'replied')}
                  className="px-4 py-2 bg-[rgba(217,81,100,1)] text-white rounded hover:bg-[rgba(217,81,100,0.8)]"
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => deleteSubmission(selectedSubmission.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
