import React, { useEffect, useState } from 'react';
import { MdOutlineMenu } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { useLocation } from 'react-router';
const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // hamburger state
  const [hamburgerActive, setHamburgerActive] = useState(false);
  //handle hamburger active
  const handleHamburger = ()=>{
    setHamburgerActive(!hamburgerActive)
  }
  useEffect(() => {
    if(hamburgerActive){
      document.getElementsByClassName('sidebar')[0].classList.remove('hide')
    }else{
      document.getElementsByClassName('sidebar')[0].classList.add('hide')
    }
  }, [hamburgerActive]);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };  const location = useLocation();
  useEffect(() => {
    setHamburgerActive(false)
  }, [location]);

  return (
    <header className='header'>
      <div className="hamburger"
      onClick={handleHamburger}
      >
        {
          
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
           { hamburgerActive?
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>:
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>}
          </svg>
        }
        

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
