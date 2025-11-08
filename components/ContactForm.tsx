'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
  files?: FileList;
}

interface ContactFormProps {
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className = "" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('full_name', data.fullName);
      formData.append('email', data.email);
      formData.append('message', data.message);

      // Append all files
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Submit to API
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Message sent successfully! We will get back to you soon.');
        reset();
        setUploadedFiles([]);
      } else {
        alert(result.error || 'Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex w-full flex-col items-center text-white font-normal leading-[1.3] mt-4 sm:mt-5 md:mt-0 ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-base sm:text-lg">
          <div className="bg-[rgba(61,26,131,1)] flex flex-col justify-center px-5 sm:px-6 md:px-7 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5 rounded-[10px] flex-1">
            <input
              type="text"
              placeholder="Full name"
              className="bg-transparent outline-none placeholder-white text-base sm:text-lg md:text-xl"
              {...register('fullName', { required: 'Full name is required' })}
              aria-label="Full name"
            />
            {errors.fullName && (
              <span className="text-red-300 text-xs sm:text-sm mt-1">{errors.fullName.message}</span>
            )}
          </div>
          <div className="bg-[rgba(61,26,131,1)] flex flex-col justify-center px-5 sm:px-6 md:px-7 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5 rounded-[10px] flex-1">
            <input
              type="email"
              placeholder="Mail address"
              className="bg-transparent outline-none placeholder-white text-base sm:text-lg md:text-xl"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              aria-label="Email address"
            />
            {errors.email && (
              <span className="text-red-300 text-xs sm:text-sm mt-1">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="bg-[rgba(61,26,131,1)] flex flex-col text-base sm:text-lg mt-3 sm:mt-4 md:mt-5 lg:mt-6 pt-4 sm:pt-5 md:pt-6 pb-24 sm:pb-28 md:pb-32 lg:pb-36 px-5 sm:px-6 md:px-7 lg:px-8 rounded-[10px]">
          <textarea
            placeholder="Message"
            className="bg-transparent outline-none placeholder-white resize-none h-full text-base sm:text-lg md:text-xl"
            rows={5}
            {...register('message', { required: 'Message is required' })}
            aria-label="Message"
          />
          {errors.message && (
            <span className="text-red-300 text-xs sm:text-sm mt-1">{errors.message.message}</span>
          )}
        </div>

        <div
          className={`bg-[rgba(61,26,131,1)] flex flex-col items-center mt-3 sm:mt-4 md:mt-5 lg:mt-6 pt-12 sm:pt-14 md:pt-16 lg:pt-18 pb-6 sm:pb-7 md:pb-8 lg:pb-9 px-10 sm:px-14 md:px-18 lg:px-20 rounded-[10px] relative cursor-pointer transition-colors ${
            dragActive ? 'bg-[rgba(71,36,141,1)]' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
            accept="image/*,.pdf,.doc,.docx"
          />
          <div className="flex w-full max-w-[240px] md:max-w-[280px] flex-col items-stretch text-center">
            <div className="text-base sm:text-lg md:text-xl">
              Click to upload your files
            </div>
            <div className="text-xs sm:text-sm md:text-base self-center mt-1.5 md:mt-2">
              (Max. File size 25 mb)
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5 right-3 sm:right-4 md:right-5">
              <div className="text-sm sm:text-base md:text-lg mb-2">Uploaded files:</div>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center bg-[rgba(51,16,121,1)] p-2 sm:p-2.5 md:p-3 rounded mb-1.5">
                  <span className="text-xs sm:text-sm md:text-base truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-300 hover:text-red-100 ml-2 text-xl sm:text-2xl"
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[rgba(217,81,100,1)] self-center flex w-[150px] sm:w-[170px] md:w-[190px] lg:w-[210px] max-w-full flex-col items-stretch text-lg sm:text-xl md:text-2xl font-black whitespace-nowrap text-center leading-none justify-center mt-4 sm:mt-5 md:mt-6 lg:mt-7 px-10 sm:px-12 md:px-14 py-3 md:py-3.5 lg:py-4 rounded-[50px] hover:bg-[rgba(207,71,90,1)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};
