import React from 'react'
import './Preview.scss'

function Preview({image,setPreviewIndex}) {
  console.log(image)
  return (
    <div className='preview'>
        <div className="image-wrap">
            <div className="image"
            style={{ backgroundImage: `url(${image})` }}
            > </div>
            <div className="controls">
              <div className="next"
              onClick={()=>setPreviewIndex(prevIndex=>prevIndex+1)}
              ></div>
              <div className="prev"
              onClick={()=>setPreviewIndex(prevIndex=>prevIndex-1)}
              ></div>
            </div>
        </div>
    </div>
  )
}

export default Preview