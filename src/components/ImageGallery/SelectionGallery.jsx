import React, { useState } from 'react';

const SelectionGallery = ({ images }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (fileUrl, event) => {
    if (selectedImages.includes(fileUrl)) {
      setSelectedImages(prevImages => prevImages.filter(image => image !== fileUrl));
    } else {
      setSelectedImages(prevImages => [...prevImages, fileUrl]);
    }
    if (event) event.stopPropagation();
  };

  return (
    <div className="gallary">
      <div className="photos">
        {
          images.map((fileUrl, index) => (
            <div 
              className="photo" 
              key={index} 
              style={{ backgroundImage: `url(${fileUrl})` }} 
              alt={`File ${index}`} 
              onClick={() => handleImageClick(fileUrl)}
            >
              <input 
                type="checkbox" 
                checked={selectedImages.includes(fileUrl)} 
                onChange={(event) => handleImageClick(fileUrl, event)} 
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default SelectionGallery;