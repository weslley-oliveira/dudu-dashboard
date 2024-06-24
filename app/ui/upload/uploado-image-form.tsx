'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface UploadFormProps {
  onFileUpload: (url: string) => void;
}

export default function UploadForm({ onFileUpload }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUploadClick = async () => {
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
        onFileUpload(result.fileUrl); // Chama a função de callback com a URL
      } else {
        console.error('Erro no upload');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveClick = async () => {
    if (!uploadedFileUrl) return;

    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl: uploadedFileUrl }),
      });

      if (response.ok) {
        setUploadedFileUrl(null);
        setFile(null);
        onFileUpload(''); // Atualiza a URL no componente pai para vazio

        // Resetar o valor do input de arquivo para permitir nova seleção
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error('Erro ao deletar a imagem');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div>
      <div className='flex items-center'>
        <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        <button
          onClick={handleUploadClick}
          disabled={!file || uploading}
          className='flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
        >
          {uploading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      {uploadedFileUrl && (
        <div className="relative flex items-start justify-center mt-4">
        <Image
          src={uploadedFileUrl}
          className="mr-2"
          width={280}
          height={280}
          alt="Uploaded file"
        />
        <button
          onClick={handleRemoveClick}
          className="bg-white rounded-md border p-2 hover:bg-gray-100"
          aria-label="Remove image"
        >
          <TrashIcon className="w-5" />
        </button>
      </div>
      )}
    </div>
  );
}