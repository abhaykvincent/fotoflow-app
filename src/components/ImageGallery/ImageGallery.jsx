import React, { useEffect, useMemo, useState } from 'react';
import Preview from '../../features/Preview/Preview';

const ImageGallery = React.memo(({ imageUrls }) => {
  let importedImages=[]
  // Preview
  // is preview open
  const [isPreviewOpen,setIsPreviewOpen] = useState(false);
  const [previewIndex,setPreviewIndex] = useState(0);
  const openPreview = (index) => {
    setIsPreviewOpen(true)
    setPreviewIndex(index)
  }
  const closePreview = () => {
    setIsPreviewOpen(false)
  }

  return (
    <div className="gallary">
      <div className="photos">
        {imageUrls.map((fileUrl, index) => (
          <div className="photo-wrap"
          onClick={()=>openPreview(index)}>
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
            <div className='photo' key={index} 
            style={{ backgroundImage: `url(${fileUrl.url})` }} alt={`File ${index}`}></div>
          </div>
        ))}
      </div>
        {
            isPreviewOpen && <Preview image={imageUrls[previewIndex].url } setPreviewIndex={setPreviewIndex}/>
        }
    </div>
  );
});

export default ImageGallery;