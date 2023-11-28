import React, { useState } from 'react';

const SelectionGallery = ({ images }) => {
  const [selectedImages, setSelectedImages] = useState(new Set());

  const handleImageClick = (fileUrl, event) => {
    const newSelectedImages = new Set(selectedImages);
    if (selectedImages.has(fileUrl)) {
      newSelectedImages.delete(fileUrl);
    } else {
      newSelectedImages.add(fileUrl);
    }
    setSelectedImages(newSelectedImages);
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
                checked={selectedImages.has(fileUrl)} 
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