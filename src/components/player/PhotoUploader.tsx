import React, { useRef, useState } from 'react';
import { IconUpload, IconClose, IconCheck } from '../common/Icons';

interface PhotoUploaderProps {
  value: string;
  onChange: (base64OrUrl: string) => void;
  error?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  value,
  onChange,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileProcess = (file: File) => {
    setUploadError('');

    // Check MIME type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Invalid format. Only JPG, PNG, and WEBP are supported.');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Photograph must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        // Preview State
        <div className="bg-cream-50 border-2 border-nearblack p-4 flex flex-col sm:flex-row items-center gap-5 shadow-brutal-sm">
          {/* Central diamond preview thumbnail simulating the player card */}
          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            <div className="w-20 h-20 rotate-45 border-2 border-nearblack overflow-hidden bg-nearblack shadow-brutal-sm">
              <img
                src={value}
                alt="Player Preview"
                className="w-full h-full object-cover -rotate-45 scale-125"
              />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 font-mono text-xs font-bold text-green-deep">
              <IconCheck className="w-4 h-4" />
              <span>PHOTO LOADED (DIAMOND ALIGNED)</span>
            </div>
            <p className="font-sans text-xs text-nearblack/70">
              Your photograph has been processed for the official 1080×1350 tournament poster.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={triggerUpload}
                className="font-mono text-xs font-bold uppercase px-3 py-1.5 bg-cream border-2 border-nearblack hover:bg-cream-200 cursor-pointer shadow-brutal-sm"
              >
                REPLACE PHOTO
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="font-mono text-xs font-bold uppercase px-3 py-1.5 bg-red-brick text-cream border-2 border-nearblack hover:bg-red-700 cursor-pointer shadow-brutal-sm"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Upload Dropzone
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerUpload}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-orange-accent bg-orange-accent/10'
              : 'border-nearblack bg-cream-50 hover:bg-cream-200'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 bg-nearblack text-cream flex items-center justify-center border-2 border-nearblack shadow-brutal-sm">
            <IconUpload className="w-6 h-6" />
          </div>
          <div className="font-display text-base uppercase tracking-tight text-nearblack mb-1">
            CLICK OR DRAG PLAYER PHOTOGRAPH
          </div>
          <div className="font-mono text-xs text-nearblack/60">
            JPG, PNG, OR WEBP • MAX 5MB • HEADSHOT / BUST RECOMMENDED
          </div>
        </div>
      )}

      {(uploadError || error) && (
        <div className="font-mono text-xs font-bold text-red-brick flex items-center gap-1.5">
          <IconClose className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{uploadError || error}</span>
        </div>
      )}
    </div>
  );
};
