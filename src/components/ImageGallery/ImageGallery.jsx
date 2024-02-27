import React, { useEffect, useMemo, useState } from 'react';
import Preview from '../../features/Preview/Preview';
import { shortenFileName } from '../../utils/stringUtils';

const ImageGallery = React.memo(({ imageUrls,projectId }) => {
  let importedImages=[]
  // Preview
  // is preview open
  console.log(imageUrls)
  const [isPreviewOpen,setIsPreviewOpen] = useState(false);
  const [previewIndex,setPreviewIndex] = useState(0);
  const openPreview = (index) => {
    setIsPreviewOpen(true)
    setPreviewIndex(index)
  }
  const closePreview = () => {
    setIsPreviewOpen(false)
  }
  //preview on hide header
  useEffect(() => {
    if(isPreviewOpen){
      document.getElementsByClassName('header')[0].style.display = 'none';
    }else{
      document.getElementsByClassName('header')[0].style.display = 'block';
    }
  }, [isPreviewOpen]);

  return (
    <div className="gallary">
      <div className="photos">
        {imageUrls.map((fileUrl, index) => (
          <div className="photo-wrap"
          onClick={()=>openPreview(index)}>
            <div className="hover-options-wrap">
            <div className="hover-options">
              {
                fileUrl.status&&
                <div className="favorite-wrap">
                  <div className={`favorite ${fileUrl?.status==='selected'? 'selected' : ''}`}>
                    <div className="icon"></div>
                  </div>
                </div>
              }
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
                      shortenFileName(fileUrl.name)
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
            isPreviewOpen && <Preview image={imageUrls[previewIndex] } {...{previewIndex,setPreviewIndex,imagesLength:imageUrls.length,closePreview,projectId}}/>
        }
    </div>
  );
});

export default ImageGallery;