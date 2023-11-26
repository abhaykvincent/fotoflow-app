import React, { useState, useEffect } from 'react';

/* Justified Layout — 
fill the width of the browser and preserve the aspect-ratio of each photo 
(no square crops). */
const ShareGallery = ({ images }) => {
  return (
    <div className="gallary">
      <div className="photos">
        {
          images.map((fileUrl, index) => (
            <div className="photo" key={index} style={{ backgroundImage: `url(${fileUrl})` }} alt={`File ${index}`}></div>
          ))}
        
      </div>
    </div>
  );
};

export default ShareGallery;
