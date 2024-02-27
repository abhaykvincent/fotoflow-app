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
        <Link to={`/storage`}>
          <div className={`menu storage ${location.pathname === '/storage' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Storage</div>
          </div>
        </Link>
        <Link to={`/store`}>
          <div className={`menu store ${location.pathname === '/store' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Store</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">PRO</div>
            </div>
          </div>
        </Link>
        <Link to={`/calendar`}>
          <div className={`menu calendar ${location.pathname === '/calendar' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Calendar</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">PRO</div>
            </div>
          </div>
        </Link>
        <Link to={`/invoices`}>
          <div className={`menu invoices ${location.pathname === '/invoices' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Invoices</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">PRO</div>
            </div>
          </div>
        </Link>
        {/* Admin */}
        <Link to={`/financials`}>
          <div className={`menu invoices ${location.pathname === '/invoices' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Team</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">PRO</div>
            </div>
          </div>
        </Link>
        <Link to={`/team`}>
          <div className={`menu settings ${location.pathname === '/settings' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Financials</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">PRO</div>
            </div>
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
