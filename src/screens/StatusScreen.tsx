import React from 'react';
import { Clock, CheckCircle2, XCircle, Download, Ban } from 'lucide-react';

export interface Job {
  id: string;
  fileName: string;
  targetFormat: string;
  progress: number;
  status: 'processing' | 'completed' | 'cancelled';
  details: string;
}

interface StatusScreenProps {
  jobs: Job[];
  onCancelJob: (id: string) => void;
  onDownloadJob: (id: string) => void;
  onOpenFolder: (id: string) => void;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({
  jobs,
  onCancelJob,
  onDownloadJob,
}) => {
  return (
    <div className="converter-screen status-screen animate-fade-in">
      <div className="screen-header">
        <h1 className="headline-lg">Status Konwersji</h1>
        <p className="body-lg subtitle">Śledź postęp lub pobierz gotowe pliki.</p>
      </div>

      <div className="status-jobs-list">
        {jobs.map((job) => {
          if (job.status === 'processing') {
            return (
              <div key={job.id} className="status-card processing card animate-fade-in">
                <div className="status-card-header">
                  <div className="status-title-group">
                    <div className="pulse-indicator" />
                    <h3 className="status-title headline-sm">Przetwarzanie w toku...</h3>
                  </div>
                  <span className="status-percentage font-semibold text-primary">{Math.round(job.progress)}%</span>
                </div>

                <p className="status-description body-md">
                  Konwertowanie pliku: <span className="font-semibold">{job.fileName}</span> do <span className="font-semibold">{job.targetFormat}</span>
                </p>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                <div className="status-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onCancelJob(job.id)}
                  >
                    <Ban size={14} />
                    <span>Anuluj</span>
                  </button>
                </div>
              </div>
            );
          } else if (job.status === 'completed') {
            return (
              <div key={job.id} className="status-card completed card animate-fade-in">
                <div className="status-card-header">
                  <div className="status-title-group">
                    <CheckCircle2 className="status-success-icon" size={24} />
                    <h3 className="status-title headline-sm">Konwersja zakończona pomyślnie</h3>
                  </div>
                </div>

                <p className="status-description body-md">
                  Plik <span className="font-semibold">{job.fileName}</span> został pomyślnie przekonwertowany do formatu <span className="font-semibold">{job.targetFormat}</span>.
                </p>

                <div className="progress-container">
                  <div className="progress-bar progress-bar-success" style={{ width: '100%' }} />
                </div>

                <div className="status-actions-group">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onDownloadJob(job.id)}
                  >
                    <Download size={14} />
                    <span>Pobierz plik</span>
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div key={job.id} className="status-card cancelled card animate-fade-in">
                <div className="status-card-header">
                  <div className="status-title-group">
                    <XCircle className="status-error-icon" size={24} />
                    <h3 className="status-title headline-sm">Konwersja anulowana</h3>
                  </div>
                </div>

                <p className="status-description body-md">
                  Konwertowanie pliku <span className="font-semibold">{job.fileName}</span> zostało przerwane przez użytkownika.
                </p>

                <div className="progress-container">
                  <div className="progress-bar progress-bar-error" style={{ width: `${job.progress}%` }} />
                </div>
              </div>
            );
          }
        })}

        {jobs.length === 0 && (
          <div className="empty-status card text-center">
            <Clock size={48} className="empty-status-icon" />
            <p className="body-lg font-semibold">Brak zadań konwersji</p>
            <p className="body-md">Wybierz narzędzie konwersji u góry i prześlij pliki, aby rozpocząć.</p>
          </div>
        )}
      </div>
    </div>
  );
};
