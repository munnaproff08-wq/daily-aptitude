import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-lg text-center p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Daily Aptitude Streak</h1>
      <p className="text-slate-600 mb-8">Upload a PDF with aptitude questions to start your daily challenge.</p>
      
      <label
        htmlFor="pdf-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-200 ${
          isDragging ? 'border-cyan-400 bg-cyan-50/80' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
        <span className="mt-4 block text-sm font-medium text-slate-700">
          {isLoading ? 'Processing PDF...' : 'Drag & drop a PDF or click to upload'}
        </span>
        <input id="pdf-upload" name="pdf-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} disabled={isLoading} />
      </label>
    </div>
  );
};

export default FileUpload;