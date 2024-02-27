import React, { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className='header'>
      <div className="hamburger">
        <RxHamburgerMenu />
      </div>
      <div className="logo"></div>
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
      
    </header>
  );
};

export default Header;
