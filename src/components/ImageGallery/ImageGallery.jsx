import React, { useMemo } from 'react';

const ImageGallery = React.memo(({ imageUrls }) => {
  const dummyUrls = useMemo(() => Array.from({ length: 15 }, (_, index) => imageUrls[index] || 'dummyurl'), [imageUrls]);

  return (
    <div className="gallary">
      <div className="photos">
        {dummyUrls.map((fileUrl, index) => (
          <div className={fileUrl!=='dummyurl'?`photo`:'photo dummy'} key={index} style={fileUrl!=='dummyurl'? { backgroundImage: `url(${fileUrl})` }:{}} alt={`File ${index}`}></div>
        ))}
      </div>
    </div>
  );
});

export default ImageGallery;