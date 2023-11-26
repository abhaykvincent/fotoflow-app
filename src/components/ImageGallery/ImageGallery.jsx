import React from 'react';

const ImageGallery = ({ imageUrls }) => {
  return (
    <div className="gallary">
      <div className="photos">
        {
          imageUrls.map((fileUrl, index) => (
            <div className="photo" key={index} style={{ backgroundImage: `url(${fileUrl})` }} alt={`File ${index}`}></div>
          ))}
        
      </div>
    </div>
  );
};

export default ImageGallery;
