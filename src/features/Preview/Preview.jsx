import React, { useEffect } from 'react'
import './Preview.scss'
import { shortenFileName } from '../../utils/stringUtils'
import { setCoverPhotoInFirestore } from '../../firebase/functions/firestore'
import { useState } from 'react'

function Preview({ image, previewIndex,setPreviewIndex,imagesLength, closePreview, projectId }) {
  const [zoomValue, setZoomValue] = useState(100)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    zoomReset()
  }, [image])
  useEffect(() => {
    console.log(imagePosition)
  }, [imagePosition])

  const zoomIn = () => {
    if (zoomValue < 100) setZoomValue(100)
    else setZoomValue(zoomValue + 100)
  }

  const zoomOut = () => {
    if (zoomValue <= 100) setZoomValue(zoomValue - 20)
    else setZoomValue(zoomValue - 100)
  }

  const zoomReset = () => {
  setTimeout(() => {
    setZoomValue(100)
    setImagePosition({ x:'center', y: 'center' })
  }, 100);
  }

  const handleMouseDown = () => {
    setIsDragging(true);
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  }

  const handleDrag = (event) => {
    event.preventDefault();
    if (!isDragging || zoomValue===100) return;

    const { movementX, movementY } = event;
    if(imagePosition.x === 'center' || imagePosition.x === 0)
    {
      setImagePosition({
        x: 0 + movementX,
        y: 0 + movementY
      });
    }
    else
    setImagePosition({
      x: imagePosition.x + movementX,
      y: imagePosition.y + movementY
    });
  }

  return (
    <div
      className='preview'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleDrag}
    >
      <div className="image-wrap">
        <div className="image"
          style={{
            backgroundImage: `url(${image.url})`,
            backgroundPositionX: zoomValue>100?`${imagePosition.x}px`:'center',
            backgroundPositionY: zoomValue>100?`${imagePosition.y}px`:'center',
            backgroundSize: `auto ${zoomValue}%`
          }}>
        </div>

      </div>
      <div className="controls">
            {(previewIndex >= imagesLength - 1) ||
          <div className="next"
            onClick={() => {
                setPreviewIndex(prevIndex => prevIndex + 1)
            }}
          ></div>
}
        {previewIndex ===0 ||<div className="prev"
          onClick={() => {
              setPreviewIndex(prevIndex => prevIndex - 1)
          }}
        ></div>}

      </div>
      <div className="controls top">
        <div className="left-controls">
          <div className="back"
            onClick={() => closePreview()}
          ></div>
          <div className="file-name">{shortenFileName(image.name)}</div>
        </div>
        <div className="right-controls">
          <div className="icon set-cover"
            onClick={() => setCoverPhotoInFirestore(projectId, image.url)}
          >Set as cover</div>
          <div className="icon download"></div>
          <div className="icon share"></div>
        </div>
        <div className="center-controls">
          <div className="magnifier">
            <div className="zoom-out"
              onClick={() => zoomOut()}
            ></div>
            <div className="zoom-value">{zoomValue}%</div>
            <div className="zoom-in"
              onClick={() => zoomIn()}
            ></div>
            <div className={`zoom-reset ${zoomValue !== 100 ? 'show' : ''}`}
              onClick={zoomReset}
            >Reset</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview
