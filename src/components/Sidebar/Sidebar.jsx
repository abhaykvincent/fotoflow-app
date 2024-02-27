import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss'
import { GrUpgrade } from "react-icons/gr";
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
          <div className={`menu store ${location.pathname === '/store' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Store</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
        <Link to={`/calendar`}>
          <div className={`menu calendar ${location.pathname === '/calendar' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Calendar</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
        <Link to={`/invoices`}>
          <div className={`menu invoices ${location.pathname === '/invoices' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Invoices</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
        {/* Admin */}
        <p className="label">ADMIN</p>
        <Link to={`/storage`}>
          <div className={`menu storage ${location.pathname === '/storage' ? 'selected' : ''}`}>
            <div className="icon"></div>
            <div className="label">Storage</div>
          </div>
        </Link>
        <Link to={`/financials`}>
          <div className={`menu accounts ${location.pathname === '/accounts' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Accounts</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
        <Link to={`/team`}>
          <div className={`menu team ${location.pathname === '/team' ? 'selected' : ''} disabled`}>
            <div className="icon"></div>
            <div className="label">Team</div>
            <div className="coming-soon">
              <div className="coming-soon-tag">SOON</div>
            </div>
          </div>
        </Link>
      </div>
      <div className="profile-options">
        <div className="profile">
          <div className="profile-image"></div>
          <div className="account-name">
            <div className="studio-name">Canbera </div>
            <div className="profile-name">John</div>
          </div>
        </div>
        <div className="option-icon"></div>
      </div>
      <div className="status">
        <div className="icon">
        <GrUpgrade />
        </div>
        <div className="message">You have 126MB left</div>
        <div className="button primary outline">Upgrade</div>
      </div>
    </div>
  );
}

export default Sidebar;
