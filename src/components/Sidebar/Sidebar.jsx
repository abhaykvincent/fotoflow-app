import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({isUploading,totalUploadProgress}) {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="menu-list">
        <Link to={`/`}>
          <div className={`menu home ${location.pathname === '/' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Home</div>
          </div>
        </Link>
        <Link to={`/projects`}>
          <div className={`menu projects ${location.pathname === '/projects' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Projects</div>
          </div>
        </Link>
        <Link to={`/store`}>
          <div className={`menu store ${location.pathname === '/store' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Store</div>
          </div>
        </Link>
        <Link to={`/settings`}>
          <div className={`menu settings ${location.pathname === '/settings' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Settings</div>
          </div>
        </Link>
      </div>
      
      <div className="status">
          {isUploading ? (
            <div className="panel uploading">
              <div className="status-label">
                <p>Uploading...</p>
                <p>50%</p>
              </div>
              <progress value={totalUploadProgress} max="100"></progress>
            </div>
          ) : (
            <div className="panel">
              {/* Add your other content here when not uploading */}
            </div>
          )}
        </div>
    </div>
  );
}

export default Sidebar;
