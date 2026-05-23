import React, { useState } from 'react';
import { DropZone } from '../components/DropZone';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';

interface ImageConverterProps {
  onStartConversion: (files: File[], options: { format: string; quality: string }) => void;
}

export const ImageConverter: React.FC<ImageConverterProps> = ({ onStartConversion }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState('JPG');
  const [quality, setQuality] = useState('Wysoka');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = () => {
    if (files.length === 0) return;
    onStartConversion(files, { format, quality });
    setFiles([]);
  };

  return (
    <div className="converter-screen animate-fade-in">
      <div className="screen-header">
        <h1 className="headline-lg">Konwersja Obrazów</h1>
        <p className="body-lg subtitle">
          Przekształć swoje obrazy w kilka sekund. Szybko, bezpiecznie i profesjonalnie.
        </p>
      </div>

      <div className="converter-container card">
        <DropZone
          onFilesSelected={handleFilesSelected}
          selectedFiles={files}
          onRemoveFile={handleRemoveFile}
          acceptedFormats=".jpg,.jpeg,.png,.webp,.gif,.bmp"
          maxSizeMB={50}
          descriptionText="Obsługiwane formaty: JPG, PNG, WEBP, GIF, BMP (Max 50MB)"
          icon={<ImageIcon size={32} className="dropzone-icon" />}
          allowMultiple={true}
        />

        <div className="settings-row">
          <div className="form-group">
            <label className="form-label" htmlFor="image-format">Format docelowy</label>
            <select
              id="image-format"
              className="form-select"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="JPG">JPG</option>
              <option value="PNG">PNG</option>
              <option value="WEBP">WEBP</option>
              <option value="GIF">GIF</option>
              <option value="BMP">BMP</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="image-quality">Jakość</label>
            <select
              id="image-quality"
              className="form-select"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="Wysoka">Wysoka</option>
              <option value="Średnia">Średnia</option>
              <option value="Niska">Niska</option>
            </select>
          </div>
        </div>

        <div className="actions-row">
          <button
            type="button"
            className="btn btn-primary"
            disabled={files.length === 0}
            onClick={handleConvert}
          >
            <span>Konwertuj</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
