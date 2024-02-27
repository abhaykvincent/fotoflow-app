import React, { useEffect } from 'react'
import './UploadProgress.scss'
function UploadProgress({uploadList}) {
    useEffect(() => {
        console.log(uploadList)
    }, [uploadList])
  return (
    <div className="upload-progress">
        <div className="header">
        <div className="header-process active">

        </div>
        <div className="header-title">
            <h4>Uploading 10 of 210</h4>
            <p>128MB Remaining</p>
        </div>
        <div className="header-actions"></div>
        <div className="total-progress">
            <div className="progress-bar"></div>
        </div>
        </div>
        <div className="body">
            <div className="upload-queue">
                {
                uploadList.map((file, index) => (
                    <div className={`upload-task ${file.status}`} key={index}>
                    <div className="task-cover"></div>
                    <div className="task-name">
                        <p className="file-name">{file.name}</p>
                        <p className="file-progress">Uploading {file.progress?file.progress+'%':''} . 123KB</p>
                    </div>
                    <div className="task-status"></div>
                    </div>
                ))
                }
            </div>
        </div>
    </div>
  )
}

export default UploadProgress