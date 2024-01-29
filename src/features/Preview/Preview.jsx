import React from 'react'
import './Preview.scss'
import { shortenFileName } from '../../utils/stringUtils'

function Preview({image,setPreviewIndex}) {
  console.log(image)
  return (
    <div className='preview'>
        <div className="image-wrap">
            <div className="image"
            style={{ backgroundImage: `url(${image.url})` }}
            > </div>
            
        </div>
        <div className="controls">
              <div className="next"
              onClick={()=>setPreviewIndex(prevIndex=>prevIndex+1)}
              ></div>
              <div className="prev"
              onClick={()=>setPreviewIndex(prevIndex=>prevIndex-1)}
              ></div>
            </div>
            <div className="controls top">
              <div className="left-controls">
                <div className="back"></div>
                <div className="file-name">{shortenFileName(image.name)}</div>
              </div>
              <div className="right-controls">
                <div className="icon download"></div>
                <div className="icon share"></div>
              </div>
              <div className="center-controls">
                <div className="magnifier">
                  <div className="zoom-out"></div>
                  <div className="zoom-value">50%</div>
                  <div className="zoom-in"></div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default Preview