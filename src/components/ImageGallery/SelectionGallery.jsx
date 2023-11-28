import React from 'react';

const SelectionGallery = ({ images, selectedImages, setSelectedImages, setSelectedImagesInCollection }) => {
  const handleImageClick = (fileUrl) => {
    const newSelectedImages = new Set(selectedImages);
    if (selectedImages.has(fileUrl)) {
      newSelectedImages.delete(fileUrl);
      setSelectedImagesInCollection((prev) => prev.filter((image) => image !== fileUrl));
    } else {
      newSelectedImages.add(fileUrl);
      setSelectedImagesInCollection((prev) => [...prev, fileUrl]);
    }
    setSelectedImages(newSelectedImages);
  };

  return (
    <div className="gallary">
      <div className="photos">
        {images.map((fileUrl, index) => (
          <div
            className="photo"
            key={index}
            style={{ backgroundImage: `url(${fileUrl.url})` }}
            aria-label={`File ${index}`}
            onClick={() => handleImageClick(fileUrl.url)}
          >
            <input
              type="checkbox"
              checked={selectedImages.has(fileUrl.url)}
              onChange={() => handleImageClick(fileUrl.url)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionGallery;