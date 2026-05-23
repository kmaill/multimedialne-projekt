import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  acceptedFormats: string;
  maxSizeMB: number;
  descriptionText: string;
  icon?: React.ReactNode;
  allowMultiple?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  acceptedFormats,
  maxSizeMB,
  descriptionText,
  icon,
  allowMultiple = true,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndAddFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError(null);
    const newFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const filesToProcess = allowMultiple ? Array.from(fileList) : [fileList[0]];

    for (const file of filesToProcess) {
      if (file.size > maxSizeBytes) {
        setError(`Plik ${file.name} jest za duży. Maksymalny rozmiar to ${maxSizeMB}MB.`);
        continue;
      }

      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedExts = acceptedFormats.split(',').map(ext => ext.trim().toLowerCase());

      const isAccepted = acceptedExts.some(ext => {
        if (ext === '.*' || ext === '*' || ext === '') return true;
        if (ext.startsWith('.')) return fileExt === ext;
        if (ext.endsWith('/*')) {
          const typeGroup = ext.split('/')[0];
          return file.type.startsWith(typeGroup + '/');
        }
        return file.type === ext;
      });

      if (!isAccepted && acceptedFormats !== '*') {
        setError(`Nieobsługiwany format pliku: ${file.name}. Wymagane formaty: ${acceptedFormats}`);
        continue;
      }

      newFiles.push(file);
    }

    if (newFiles.length > 0) {
      onFilesSelected(allowMultiple ? [...selectedFiles, ...newFiles] : newFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    validateAndAddFiles(e.target.files);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="dropzone-container">
      <div
        className={`dropzone ${isDragActive ? 'drag-active' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="dropzone-input"
          multiple={allowMultiple}
          onChange={handleChange}
          accept={acceptedFormats}
        />

        <div className="dropzone-content">
          <div className="dropzone-icon-container">
            {icon || <Upload size={32} className="dropzone-icon" />}
          </div>
          <p className="dropzone-text-primary">
            {allowMultiple ? 'Przeciągnij i upuść pliki tutaj' : 'Przeciągnij i upuść plik tutaj'}
          </p>
          <p className="dropzone-text-secondary">
            lub kliknij, aby wybrać {allowMultiple ? 'pliki' : 'plik'} z dysku
          </p>
          <button type="button" className="btn btn-secondary dropzone-btn" onClick={onButtonClick}>
            Wybierz {allowMultiple ? 'pliki' : 'plik'}
          </button>
          {descriptionText && (
            <p className="dropzone-format-info">{descriptionText}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="dropzone-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="selected-files-list">
          <p className="selected-files-title">Wybrane pliki ({selectedFiles.length}):</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="selected-file-item animate-fade-in">
              <div className="file-item-info">
                <FileText size={18} className="file-item-icon" />
                <div className="file-item-details">
                  <span className="file-item-name">{file.name}</span>
                  <span className="file-item-size">{formatBytes(file.size)}</span>
                </div>
              </div>
              <button
                type="button"
                className="file-item-remove"
                onClick={() => onRemoveFile(index)}
                aria-label="Usuń plik"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
