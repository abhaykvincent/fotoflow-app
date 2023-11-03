import React, { useState } from 'react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header>
      <div className="logo">Your Logo</div>
      <div className="search-bar">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search projects"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      <div className="profile-options">
        <div className="profile">
          <div className="profile-name">Ashish Monalisa</div>
          <div className="profile-image"></div>
        </div>
        <div className="option-icon"></div>
      </div>
    </header>
  );
};

export default Header;
