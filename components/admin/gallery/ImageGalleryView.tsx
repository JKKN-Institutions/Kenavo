'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Edit2, Trash2, Star, RefreshCw, GripVertical } from 'lucide-react';
import { GalleryAlbum, GalleryImage } from '@/lib/types/gallery';
import ImageDetailModal from './ImageDetailModal';
import SetThumbnailModal from './SetThumbnailModal';

interface ImageGalleryViewProps {
  album: GalleryAlbum;
  onUpdate: () => void;
}

export default function ImageGalleryView({ album, onUpdate }: ImageGalleryViewProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, [album.id]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/gallery/images?album_id=${album.id}`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`Delete this image? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/images/${image.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchImages();
        onUpdate();
      } else {
        const result = await response.json();
        alert(`Delete failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    setReordering(true);

    // Update display_order for all images
    const updates = images.map((img, index) => ({
      id: img.id,
      display_order: index,
    }));

    try {
      const response = await fetch('/api/admin/gallery/images/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (response.ok) {
        fetchImages();
      } else {
        alert('Failed to save new order');
        fetchImages(); // Reload to reset order
      }
    } catch (error) {
      alert('Error saving order');
      fetchImages();
    } finally {
      setDraggedIndex(null);
      setReordering(false);
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          Images ({images.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThumbnailModal(true)}
            disabled={images.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            <Star size={16} />
            Set Thumbnail
          </button>
          <button
            onClick={fetchImages}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p>Loading images...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
          <p>No images in this album yet</p>
          <p className="text-sm mt-1">Upload some images to get started</p>
        </div>
      ) : (
        <>
          {reordering && (
            <div className="mb-4 p-3 bg-blue-500/20 text-blue-100 rounded-lg text-sm">
              Saving new order...
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group bg-white/5 rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                  draggedIndex === index ? 'border-purple-500 opacity-50' : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 z-10 bg-black/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <GripVertical size={16} className="text-white" />
                </div>

                {/* Order Badge */}
                <div className="absolute top-2 right-2 z-10 bg-black/70 px-2 py-1 rounded text-white text-xs font-bold">
                  #{index + 1}
                </div>

                {/* Image */}
                <img
                  src={image.image_url}
                  alt={image.caption || `Image ${index + 1}`}
                  className="w-full h-40 object-cover"
                />

                {/* Caption */}
                {image.caption && (
                  <div className="px-2 py-1 text-white text-xs truncate bg-black/30">
                    {image.caption}
                  </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(image)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Active Status */}
                {!image.is_active && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs text-center py-1">
                    Inactive
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-200 text-xs">
            <strong>Tip:</strong> Drag and drop images to reorder them. The order will be saved automatically.
          </div>
        </>
      )}

      {/* Modals */}
      {editingImage && (
        <ImageDetailModal
          image={editingImage}
          onClose={() => {
            setEditingImage(null);
            fetchImages();
            onUpdate();
          }}
        />
      )}

      {showThumbnailModal && (
        <SetThumbnailModal
          album={album}
          images={images}
          onClose={() => {
            setShowThumbnailModal(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
