'use client';

import Image from 'next/image';
import { useState } from 'react';

interface UploadFormProps {
  onFileUpload: (url: string) => void;
}

export default function UploadForm({ onFileUpload }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedFileUrl(result.fileUrl);
        onFileUpload(result.fileUrl);  // Chama a função de callback com a URL
      } else {
        console.error('Erro no upload');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Enviando...' : 'Enviar'}
      </button>
      {uploadedFileUrl && (
        <div>
          <p>Arquivo enviado com sucesso:</p>
          <Image
            src={uploadedFileUrl}
            className="mr-2"
            width={280}
            height={280}
            alt={`profile picture`}
          />
        </div>
      )}
    </form>
  );
}