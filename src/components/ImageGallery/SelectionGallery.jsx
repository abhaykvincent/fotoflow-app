import React, { useState } from 'react';

const SelectionGallery = ({ images ,selectedImages,setSelectedImages,setSelectedImagesInCollection}) => {

  const handleImageClick = (fileUrl, event) => {
    const newSelectedImages = new Set(selectedImages);
    if (selectedImages.has(fileUrl)) {
      newSelectedImages.delete(fileUrl);
      setSelectedImagesInCollection((prev) => prev.filter((image) => image !== fileUrl));
    } else {
      newSelectedImages.add(fileUrl);
      setSelectedImagesInCollection((prev) => [...prev, fileUrl]);
    }
    setSelectedImages(newSelectedImages);
    //push fileUrl to selectedImagesInCollection
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
              style={{ backgroundImage: `url(${fileUrl.url})` }} 
              alt={`File ${index}`} 
              onClick={() => handleImageClick(fileUrl.url)}
            >
              <input 
                type="checkbox" 
                checked={selectedImages.has(fileUrl.url)} 
                onChange={(event) => handleImageClick(fileUrl.url, event)} 
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default SelectionGallery;