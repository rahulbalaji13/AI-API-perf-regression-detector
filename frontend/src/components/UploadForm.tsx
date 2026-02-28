"use client";

import { useState } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus('idle');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      setStatus('success');
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-indigo-400" />
        Upload API Logs
      </h3>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center hover:bg-slate-700/30 transition cursor-pointer relative over">
          <input 
            type="file" 
            accept=".csv,.json"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <File className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm text-slate-300">
            {file ? file.name : "Drag & drop CSV/JSON or click to browse"}
          </p>
        </div>

        <button 
          disabled={!file || uploading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl font-medium transition shadow-lg shadow-indigo-500/20"
        >
          {uploading ? "Processing Analysis..." : "Upload & Analyze"}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Logs uploaded and processing started in background.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Upload failed. Please check the file format.</span>
        </div>
      )}
    </div>
  );
}
