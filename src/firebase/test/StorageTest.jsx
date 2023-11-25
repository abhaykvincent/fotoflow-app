import React, { useState } from 'react';
import { uploadMultipleFiles } from './test-storage-functions';

function UploadImages() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={()=>uploadMultipleFiles(selectedFiles)}
      >Upload</button>
    </div>
  );
}

export default UploadImages;
