import React, { useState } from 'react';
import { DropZone } from '../components/DropZone';
import { Music, ArrowRight } from 'lucide-react';

interface AudioConverterProps {
  onStartConversion: (files: File[], options: { format: string; bitrate: string }) => void;
}

export const AudioConverter: React.FC<AudioConverterProps> = ({ onStartConversion }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState('MP3');
  const [bitrate, setBitrate] = useState('128 kbps');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = () => {
    if (files.length === 0) return;
    onStartConversion(files, { format, bitrate });
    setFiles([]);
  };

  return (
    <div className="converter-screen animate-fade-in">
      <div className="screen-header">
        <h1 className="headline-lg">Konwersja Dźwięku</h1>
        <p className="body-lg subtitle">
          Przeciągnij i upuść pliki dźwiękowe, wybierz format docelowy i rozpocznij konwersję.
        </p>
      </div>

      <div className="converter-container card">
        <DropZone
          onFilesSelected={handleFilesSelected}
          selectedFiles={files}
          onRemoveFile={handleRemoveFile}
          acceptedFormats=".mp3,.wav,.ogg,.flac,.aac,.m4a"
          maxSizeMB={100}
          descriptionText="Obsługiwane formaty: MP3, WAV, OGG, FLAC, AAC (Max 100MB)"
          icon={<Music size={32} className="dropzone-icon" />}
          allowMultiple={true}
        />

        <div className="settings-row">
          <div className="form-group">
            <label className="form-label" htmlFor="audio-format">Format docelowy</label>
            <select
              id="audio-format"
              className="form-select"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="MP3">MP3</option>
              <option value="WAV">WAV</option>
              <option value="AAC">AAC</option>
              <option value="FLAC">FLAC</option>
              <option value="OGG">OGG</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="audio-bitrate">Bitrate / Jakość</label>
            <select
              id="audio-bitrate"
              className="form-select"
              value={bitrate}
              onChange={(e) => setBitrate(e.target.value)}
            >
              <option value="128 kbps">128 kbps</option>
              <option value="192 kbps">192 kbps</option>
              <option value="256 kbps">256 kbps</option>
              <option value="320 kbps">320 kbps</option>
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
