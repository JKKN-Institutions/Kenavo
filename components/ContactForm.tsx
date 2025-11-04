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
      // Simulate form submission
      console.log('Form submitted:', data);
      console.log('Uploaded files:', uploadedFiles);
      
      // Here you would typically send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Message sent successfully!');
      reset();
      setUploadedFiles([]);
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
    <div className={`flex w-full flex-col items-stretch text-white font-normal leading-[1.3] mt-6 sm:mt-8 md:mt-[30px] ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-[15px] text-base sm:text-lg">
          <div className="bg-[rgba(61,26,131,1)] flex flex-col justify-center px-4 sm:px-5 py-3 sm:py-[19px] rounded-[10px] flex-1">
            <input
              type="text"
              placeholder="Full name"
              className="bg-transparent outline-none placeholder-white text-sm sm:text-base"
              {...register('fullName', { required: 'Full name is required' })}
              aria-label="Full name"
            />
            {errors.fullName && (
              <span className="text-red-300 text-xs sm:text-sm mt-1">{errors.fullName.message}</span>
            )}
          </div>
          <div className="bg-[rgba(61,26,131,1)] flex flex-col justify-center px-4 sm:px-5 md:px-[29px] py-3 sm:py-[19px] rounded-[10px] flex-1">
            <input
              type="email"
              placeholder="Mail address"
              className="bg-transparent outline-none placeholder-white text-sm sm:text-base"
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

        <div className="bg-[rgba(61,26,131,1)] flex flex-col text-base sm:text-lg mt-3 sm:mt-[17px] pt-3 sm:pt-[17px] pb-24 sm:pb-28 md:pb-[121px] px-4 sm:px-5 rounded-[10px]">
          <textarea
            placeholder="Message"
            className="bg-transparent outline-none placeholder-white resize-none h-full text-sm sm:text-base"
            rows={4}
            {...register('message', { required: 'Message is required' })}
            aria-label="Message"
          />
          {errors.message && (
            <span className="text-red-300 text-xs sm:text-sm mt-1">{errors.message.message}</span>
          )}
        </div>

        <div
          className={`bg-[rgba(61,26,131,1)] flex flex-col items-center mt-3 sm:mt-[17px] pt-16 sm:pt-20 md:pt-[89px] pb-6 sm:pb-8 md:pb-9 px-8 sm:px-12 md:px-20 rounded-[10px] relative cursor-pointer transition-colors ${
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
          <div className="flex w-full max-w-[201px] flex-col items-stretch text-center">
            <div className="text-sm sm:text-base md:text-lg">
              Click to upload your files
            </div>
            <div className="text-[10px] sm:text-xs self-center mt-1 sm:mt-[5px]">
              (Max. File size 25 mb)
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4">
              <div className="text-xs sm:text-sm mb-2">Uploaded files:</div>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center bg-[rgba(51,16,121,1)] p-1.5 sm:p-2 rounded mb-1">
                  <span className="text-[10px] sm:text-xs truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-300 hover:text-red-100 ml-2 text-lg sm:text-xl"
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
          className="bg-[rgba(217,81,100,1)] self-center flex w-[140px] sm:w-[160px] md:w-[170px] max-w-full flex-col items-stretch text-base sm:text-lg font-black whitespace-nowrap text-center leading-none justify-center mt-4 sm:mt-5 md:mt-[22px] px-8 sm:px-12 md:px-14 py-2.5 sm:py-3 rounded-[50px] hover:bg-[rgba(207,71,90,1)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};
