import React, { useState } from 'react';
import { DropZone } from '../components/DropZone';
import { Video, Check } from 'lucide-react';

interface VideoConverterProps {
  onStartConversion: (files: File[], options: { format: string; codec: string; quality: string }) => void;
}

export const VideoConverter: React.FC<VideoConverterProps> = ({ onStartConversion }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState('MP4 (Zalecane)');
  const [codec, setCodec] = useState('H.264 (Najlepsza kompatybilność)');
  const [quality, setQuality] = useState('Wysoka (Zalecana)');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = () => {
    if (files.length === 0) return;
    onStartConversion(files, { format, codec, quality });
    setFiles([]);
  };

  return (
    <div className="converter-screen video-converter animate-fade-in">
      <div className="screen-header">
        <h1 className="headline-lg">Konwersja Wideo</h1>
        <p className="body-lg subtitle">
          Prześlij plik wideo, aby go skonwertować. Wybierz odpowiedni format docelowy, kodek oraz jakość, aby dostosować plik do swoich potrzeb. Obsługujemy popularne formaty, takie jak MP4, MKV i AVI.
        </p>
      </div>

      <div className="video-grid">
        <div className="video-drop-column">
          <DropZone
            onFilesSelected={handleFilesSelected}
            selectedFiles={files}
            onRemoveFile={handleRemoveFile}
            acceptedFormats=".mp4,.mkv,.avi,.mov,.webm"
            maxSizeMB={2048}
            descriptionText="Przeciągnij i upuść plik wideo tutaj lub kliknij, aby wybrać z dysku (Max 2GB)"
            icon={<Video size={32} className="dropzone-icon" />}
            allowMultiple={false}
          />
        </div>

        <div className="video-settings-column">
          <div className="card settings-card">
            <h2 className="headline-sm card-title">Ustawienia konwersji</h2>

            <div className="settings-stack">
              <div className="form-group">
                <label className="form-label" htmlFor="video-format">Format docelowy / Kontener</label>
                <select
                  id="video-format"
                  className="form-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="MP4 (Zalecane)">MP4 (Zalecane)</option>
                  <option value="MKV">MKV</option>
                  <option value="AVI">AVI</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="video-codec">Kodek wideo</label>
                <select
                  id="video-codec"
                  className="form-select"
                  value={codec}
                  onChange={(e) => setCodec(e.target.value)}
                >
                  <option value="H.264 (Najlepsza kompatybilność)">H.264 (Najlepsza kompatybilność)</option>
                  <option value="H.265/HEVC">H.265/HEVC</option>
                  <option value="VP9">VP9</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="video-quality">Jakość wyjściowa</label>
                <select
                  id="video-quality"
                  className="form-select"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                >
                  <option value="Wysoka (Zalecana)">Wysoka (Zalecana)</option>
                  <option value="Średnia">Średnia</option>
                  <option value="Niska">Niska</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block video-convert-btn"
              disabled={files.length === 0}
              onClick={handleConvert}
            >
              <Check size={16} />
              <span>Konwertuj wideo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
