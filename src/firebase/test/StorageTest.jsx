import React, { useState } from 'react';
import { uploadMultipleFiles } from './test-storage-functions';

function UploadImages() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    try {
      const downloadURLs = await uploadMultipleFiles(selectedFiles);
      console.log('Uploaded files:', downloadURLs);
      // Do something with the download URLs, e.g., display them in the UI
    } catch (error) {
      console.error('Error uploading files:', error);
      // Handle the error, e.g., display an error message in the UI
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadImages;
