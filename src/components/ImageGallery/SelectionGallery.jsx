import React, { useCallback, memo } from 'react';
const SelectionGallery = ({ images, selectedImages, setSelectedImages, setSelectedImagesInCollection }) => {
  const handleImageClick = useCallback((fileUrl) => {
    console.log("Clicked image URL: ", fileUrl);

    const newSelectedImages = { ...selectedImages };

    if (selectedImages[fileUrl]) {
      delete newSelectedImages[fileUrl];
      setSelectedImagesInCollection((prev) => prev.filter((image) => image !== fileUrl));
    } else {
      newSelectedImages[fileUrl] = true;
      setSelectedImagesInCollection((prev) => [...prev, fileUrl]);
    }

    setSelectedImages(newSelectedImages);
    console.log("Selected images after click: ", newSelectedImages);
  }, [selectedImages, setSelectedImages, setSelectedImagesInCollection]);

  const ImageComponent = React.memo(({ fileUrl, index, handleImageClick }) => (
    <div
      className="photo"
      key={index}
      style={{ backgroundImage: `url(${fileUrl.url})` }}
      aria-label={`File ${index}`}
      onClick={() => handleImageClick(fileUrl.url)}
    >
      <input
        type="checkbox"
        checked={!!selectedImages[fileUrl.url]}
        onChange={() => handleImageClick(fileUrl.url)}
      />
    </div>
  ));

  return (
    <div className="gallary">
      <div className="photos">
        {images.map((fileUrl, index) => (
          <ImageComponent key={index} fileUrl={fileUrl} index={index} handleImageClick={handleImageClick} />
        ))}
      </div>
    </div>
  );
};

export default SelectionGallery;