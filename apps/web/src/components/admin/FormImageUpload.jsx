
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Link as LinkIcon, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthToken } from '@/lib/dbClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = 'images';

const uploadToStorage = async (file) => {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const token = await getAuthToken();

  const res = await window.fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: file,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload falhou: ${res.status}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
};

export function FormImageUpload({ label, id, onChange, currentImage }) {
  const [preview, setPreview] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!currentImage) {
      setPreview(null);
      setUrlInput('');
      return;
    }
    if (typeof currentImage === 'string') {
      setPreview(currentImage);
      setUrlInput(currentImage);
    } else if (currentImage instanceof File) {
      const objectUrl = URL.createObjectURL(currentImage);
      setPreview(objectUrl);
      setUrlInput('');
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadToStorage(file);
      setPreview(publicUrl);
      onChange({ target: { name: id, value: publicUrl } });
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('[FormImageUpload] Upload error:', error);
      toast.error(error.message || 'Erro ao enviar imagem.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    onChange({ target: { name: id, value: val } });
  };

  const handleRemove = () => {
    onChange({ target: { name: id, value: null } });
    setUrlInput('');
    setPreview(null);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {preview && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0 group shadow-sm">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remover imagem"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        )}

        <div className="flex-1 w-full space-y-3">
          <div className="relative">
            {isUploading ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              id={id}
              name={id}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="pl-9 bg-background text-foreground cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ou insira a URL da imagem..."
              value={urlInput}
              onChange={handleUrlChange}
              disabled={isUploading}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
