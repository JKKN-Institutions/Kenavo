'use client';

import React, { useState, useEffect } from 'react';
import GalleryCard from './GalleryCard';

interface GalleryAlbum {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  display_order: number;
  image_count: number;
}

const GalleryGrid: React.FC = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gallery/albums', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }

      const data = await response.json();
      setAlbums(data.albums || []);
    } catch (err: any) {
      console.error('Error fetching albums:', err);
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full max-w-[931px] mx-auto px-4 sm:px-6 md:px-8 mt-12 sm:mt-16 md:mt-20 lg:mt-[119px]" aria-label="Photo gallery">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-[931px] mx-auto px-4 sm:px-6 md:px-8 mt-12 sm:mt-16 md:mt-20 lg:mt-[119px]" aria-label="Photo gallery">
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={fetchAlbums}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (albums.length === 0) {
    return (
      <section className="w-full max-w-[931px] mx-auto px-4 sm:px-6 md:px-8 mt-12 sm:mt-16 md:mt-20 lg:mt-[119px]" aria-label="Photo gallery">
        <div className="text-center py-20">
          <p className="text-white text-lg">No gallery albums available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[931px] mx-auto px-4 sm:px-6 md:px-8 mt-12 sm:mt-16 md:mt-20 lg:mt-[119px]" aria-label="Photo gallery">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {albums.map((album) => (
          <div key={album.id} className="w-full">
            <GalleryCard
              title={album.name}
              imageSrc={album.thumbnail_url || '/placeholder-gallery.jpg'}
              href={`/gallery/${album.slug}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryGrid;
