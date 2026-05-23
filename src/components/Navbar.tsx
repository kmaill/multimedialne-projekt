import React from 'react';
import { RefreshCw, Image, Music, Video, Clock } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  activeJobsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab, activeJobsCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setTab('image')}>
          <RefreshCw className="navbar-brand-icon" size={22} />
          <span className="navbar-brand-text">FileConvert</span>
        </div>

        <div className="navbar-links">
          <button
            className={`nav-link ${currentTab === 'image' ? 'active' : ''}`}
            onClick={() => setTab('image')}
          >
            <Image size={16} />
            <span>Zdjęcia</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'audio' ? 'active' : ''}`}
            onClick={() => setTab('audio')}
          >
            <Music size={16} />
            <span>Audio</span>
          </button>

          <button
            className={`nav-link ${currentTab === 'video' ? 'active' : ''}`}
            onClick={() => setTab('video')}
          >
            <Video size={16} />
            <span>Wideo</span>
          </button>

          <button
            className={`nav-link nav-link-status ${currentTab === 'status' ? 'active' : ''}`}
            onClick={() => setTab('status')}
          >
            <Clock size={16} />
            <span>Status</span>
            {activeJobsCount > 0 && (
              <span className="job-badge">{activeJobsCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
