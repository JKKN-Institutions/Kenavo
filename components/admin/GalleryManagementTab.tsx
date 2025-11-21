'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, FolderOpen, RefreshCw } from 'lucide-react';
import { GalleryAlbum } from '@/lib/types/gallery';
import AlbumList from './gallery/AlbumList';
import ImageUploader from './gallery/ImageUploader';
import ImageGalleryView from './gallery/ImageGalleryView';

export default function GalleryManagementTab() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchAlbums();
  }, [refreshTrigger]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/gallery/albums', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedAlbums = data.albums || [];
        setAlbums(updatedAlbums);

        // Update selectedAlbum with fresh data if one is selected
        if (selectedAlbum) {
          const updatedSelectedAlbum = updatedAlbums.find(
            (album: GalleryAlbum) => album.id === selectedAlbum.id
          );
          if (updatedSelectedAlbum) {
            setSelectedAlbum(updatedSelectedAlbum);
          }
        }
      } else {
        console.error('Failed to fetch albums');
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAlbumSelect = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
  };

  const handleAlbumUpdate = () => {
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-neutral-200">
        <div>
          <h2 className="text-2xl font-bold text-[#4E2E8C] mb-2">Gallery Management</h2>
          <p className="text-neutral-600">Manage gallery albums and images</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-yellow hover:bg-accent-400 text-[#4E2E8C] font-semibold transition-all shadow-sm hover:shadow-md"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-neutral-600 text-center py-16 bg-neutral-50 rounded-xl border-2 border-neutral-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-neutral-200 border-t-[#4E2E8C] mb-4"></div>
          <p className="text-sm font-medium">Loading albums...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Album List */}
          <div className="lg:col-span-1">
            <AlbumList
              albums={albums}
              selectedAlbum={selectedAlbum}
              onSelectAlbum={handleAlbumSelect}
              onAlbumUpdate={handleAlbumUpdate}
            />
          </div>

          {/* Right: Selected Album View */}
          <div className="lg:col-span-2">
            {selectedAlbum ? (
              <div className="space-y-6">
                {/* Album Header */}
                <div className="bg-[#4E2E8C]/5 rounded-lg p-4 border-2 border-[#4E2E8C]/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {selectedAlbum.thumbnail_url ? (
                        <img
                          src={selectedAlbum.thumbnail_url}
                          alt={selectedAlbum.name}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-[#4E2E8C]"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-neutral-100 flex items-center justify-center border-2 border-neutral-300">
                          <FolderOpen size={32} className="text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-[#4E2E8C]">{selectedAlbum.name}</h3>
                        <p className="text-neutral-600 text-sm mt-1">{selectedAlbum.description}</p>
                        <p className="text-neutral-500 text-xs mt-2">Slug: {selectedAlbum.slug}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Uploader */}
                <ImageUploader
                  album={selectedAlbum}
                  onUploadComplete={handleRefresh}
                />

                {/* Image Gallery */}
                <ImageGalleryView
                  album={selectedAlbum}
                  onUpdate={handleRefresh}
                />
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg p-12 border-2 border-neutral-200 text-center">
                <ImageIcon size={64} className="text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#4E2E8C] mb-2">Select an Album</h3>
                <p className="text-neutral-600">
                  Choose an album from the list to manage its images
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
