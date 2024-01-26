import React, { useMemo } from 'react';

const ImageGallery = React.memo(({ imageUrls }) => {
  let importedImages=[]
  return (
    <div className="gallary">
      <div className="photos">
        {imageUrls.map((fileUrl, index) => (
          <div className="photo-wrap">
            <div className="hover-options-wrap">
            <div className="hover-options">
              <div className="top">
                <div className="menu-icon"></div>
                <div className="option-menu">
                  <div className="photo-option">Download</div>
                  <div className="photo-option">Share</div>
                  <div className="photo-option">Set as cover</div>
                  <div className="photo-option">Delete</div>
                </div>
              </div>
              <div className="bottom">
                  <div className="filename">
                    {
                      fileUrl.name?.length > 30
                        ? `${fileUrl.name.substring(0, 10)}...${fileUrl.name.substring(fileUrl.name.length - 10)}`
                        : fileUrl.name
                    }
                  </div>

              </div>
            </div>
            </div>
            <div className={fileUrl!=='dummyurl'?`photo`:'photo dummy'} key={index} style={fileUrl!=='dummyurl'? { backgroundImage: `url(${fileUrl.url})` }:{}} alt={`File ${index}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ImageGallery;