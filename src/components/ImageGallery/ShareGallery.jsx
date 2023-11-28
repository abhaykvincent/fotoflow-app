import React, { useState, useEffect } from 'react';

const ShareGallery = ({ images }) => {
  return (
    <div className="gallary">
      <div className="photos">
        {
          images.map((fileUrl, index) => (
            <div className="photo" key={index} style={{ backgroundImage: `url(${fileUrl})` }} alt={`File ${index}`}></div>
          ))
        }
      </div>
    </div>
  );
};

export default ShareGallery;
