'use client';

import React, { useState, useMemo } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

// Interface for image mapping
export interface ImageMapping {
  profileId: number;
  profileName: string;
  currentImageUrl: string | null;
  newImagePreview: string;
  fileName: string;
  fileSize: number;
  status: 'ready' | 'error';
  error?: string;
}

// Props for the modal
interface BulkImagePreviewModalProps {
  mappings: ImageMapping[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isApplying?: boolean;
}

type FilterType = 'all' | 'matched' | 'errors';

export default function BulkImagePreviewModal({
  mappings,
  isOpen,
  onClose,
  onConfirm,
  isApplying = false,
}: BulkImagePreviewModalProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  // Calculate stats
  const stats = useMemo(() => {
    const matched = mappings.filter(m => m.status === 'ready').length;
    const errors = mappings.filter(m => m.status === 'error').length;
    return {
      total: mappings.length,
      matched,
      errors,
    };
  }, [mappings]);

  // Filter mappings based on selected filter
  const filteredMappings = useMemo(() => {
    if (filter === 'matched') {
      return mappings.filter(m => m.status === 'ready');
    }
    if (filter === 'errors') {
      return mappings.filter(m => m.status === 'error');
    }
    return mappings;
  }, [mappings, filter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Preview Bulk Image Upload
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Review the mappings before applying changes
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isApplying}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b bg-gray-50">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Images</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.matched}</div>
            <div className="text-sm text-gray-600">Matched Profiles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.errors}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 p-4 border-b">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('matched')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'matched'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Matched ({stats.matched})
          </button>
          <button
            onClick={() => setFilter('errors')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'errors'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Errors ({stats.errors})
          </button>
        </div>

        {/* Mappings Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredMappings.map((mapping, index) => (
              <div
                key={`${mapping.profileId}-${index}`}
                className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg border ${
                  mapping.status === 'ready'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                {/* Status Icon */}
                <div className="col-span-1 flex justify-center">
                  {mapping.status === 'ready' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>

                {/* Profile Info */}
                <div className="col-span-3">
                  <div className="font-semibold text-gray-900">
                    {mapping.profileName || `Profile #${mapping.profileId}`}
                  </div>
                  <div className="text-sm text-gray-600">ID: {mapping.profileId}</div>
                  <div className="text-xs text-gray-500 mt-1">{mapping.fileName}</div>
                </div>

                {/* Current Image */}
                <div className="col-span-3">
                  <div className="text-xs text-gray-600 mb-1">Current Image</div>
                  {mapping.currentImageUrl ? (
                    <img
                      src={mapping.currentImageUrl}
                      alt="Current"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="col-span-1 flex justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>

                {/* New Image */}
                <div className="col-span-3">
                  <div className="text-xs text-gray-600 mb-1">New Image</div>
                  <img
                    src={mapping.newImagePreview}
                    alt="New"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                </div>

                {/* Error Message (if any) */}
                {mapping.error && (
                  <div className="col-span-12 mt-2 flex items-start gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{mapping.error}</span>
                  </div>
                )}
              </div>
            ))}

            {filteredMappings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No items to display for this filter.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {stats.matched > 0 && (
              <span>
                Ready to update {stats.matched} profile{stats.matched !== 1 ? 's' : ''}
              </span>
            )}
            {stats.errors > 0 && stats.matched > 0 && <span> • </span>}
            {stats.errors > 0 && (
              <span className="text-red-600">
                {stats.errors} error{stats.errors !== 1 ? 's' : ''} will be skipped
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isApplying}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isApplying || stats.matched === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying...
                </>
              ) : (
                `Apply Updates (${stats.matched})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
