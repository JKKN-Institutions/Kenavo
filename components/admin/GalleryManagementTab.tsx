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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Gallery Management</h2>
          <p className="text-purple-200">Manage gallery albums and images</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-white text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p>Loading albums...</p>
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
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {selectedAlbum.thumbnail_url ? (
                        <img
                          src={selectedAlbum.thumbnail_url}
                          alt={selectedAlbum.name}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-white/30"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center border-2 border-white/30">
                          <FolderOpen size={32} className="text-white/50" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedAlbum.name}</h3>
                        <p className="text-purple-200 text-sm mt-1">{selectedAlbum.description}</p>
                        <p className="text-white/50 text-xs mt-2">Slug: {selectedAlbum.slug}</p>
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
              <div className="bg-white/5 rounded-lg p-12 border border-white/20 text-center">
                <ImageIcon size={64} className="text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select an Album</h3>
                <p className="text-purple-200">
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
