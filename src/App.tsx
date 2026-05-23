import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ImageConverter } from './screens/ImageConverter';
import { AudioConverter } from './screens/AudioConverter';
import { VideoConverter } from './screens/VideoConverter';
import { StatusScreen } from './screens/StatusScreen';
import type { Job } from './screens/StatusScreen';
import { Check, AlertCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

function App() {
  const [currentTab, setTab] = useState<string>('image');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'mock-1',
      fileName: 'muzyka.mp3',
      targetFormat: 'wav',
      progress: 45,
      status: 'processing',
      details: 'Konwertowanie pliku: muzyka.mp3 do wav',
    },
    {
      id: 'mock-2',
      fileName: 'zdjecie.jpg',
      targetFormat: 'png',
      progress: 100,
      status: 'completed',
      details: 'Plik zdjecie.jpg został pomyślnie przekonwertowany do formatu png.',
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.status === 'processing' && job.id.startsWith('user-')) {
            const nextProgress = job.progress + Math.random() * 15 + 5;
            if (nextProgress >= 100) {
              addToast(`Konwersja pliku ${job.fileName} zakończona pomyślnie!`, 'success');
              return {
                ...job,
                progress: 100,
                status: 'completed',
              };
            }
            return {
              ...job,
              progress: nextProgress,
            };
          }
          return job;
        })
      );
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleStartConversion = (files: File[], options: any) => {
    const format = options.format.split(' ')[0];
    
    const newJobs: Job[] = files.map((file, index) => ({
      id: `user-${Date.now()}-${index}`,
      fileName: file.name,
      targetFormat: format,
      progress: 0,
      status: 'processing',
      details: `Konwertowanie pliku: ${file.name} do ${format}`,
    }));

    setJobs((prev) => [newJobs[0], ...prev]);
    addToast(`Rozpoczęto konwersję pliku: ${files[0].name}`, 'info');
    setTab('status');
  };

  const handleCancelJob = (id: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === id) {
          addToast(`Anulowano konwersję pliku: ${job.fileName}`, 'error');
          return { ...job, status: 'cancelled' };
        }
        return job;
      })
    );
  };

  const handleDownloadJob = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      addToast(`Pobieranie pliku: ${job.fileName.split('.')[0]}.${job.targetFormat.toLowerCase()}`, 'success');
    }
  };

  const handleOpenFolder = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      addToast(`Otwieranie folderu docelowego dla pliku: ${job.fileName}`, 'info');
    }
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'processing' && j.id.startsWith('user-')).length;

  return (
    <div className="app-container">
      <Navbar 
        currentTab={currentTab} 
        setTab={setTab} 
        activeJobsCount={activeJobsCount} 
      />
      
      <main className="main-content">
        {currentTab === 'image' && (
          <ImageConverter onStartConversion={handleStartConversion} />
        )}
        {currentTab === 'audio' && (
          <AudioConverter onStartConversion={handleStartConversion} />
        )}
        {currentTab === 'video' && (
          <VideoConverter onStartConversion={handleStartConversion} />
        )}
        {currentTab === 'status' && (
          <StatusScreen
            jobs={jobs}
            onCancelJob={handleCancelJob}
            onDownloadJob={handleDownloadJob}
            onOpenFolder={handleOpenFolder}
          />
        )}
      </main>

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} animate-slide-in`}>
            {toast.type === 'success' && <Check size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
