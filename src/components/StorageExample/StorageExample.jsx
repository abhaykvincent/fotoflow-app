import React, { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  connectStorageEmulator
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { useEffect } from "react";
const firebaseConfig = {
    apiKey: "AIzaSyDmAGZJTd1xSofgYgyQeGOYP2dSiLE646U",
    authDomain: "fotoflow-dev.firebaseapp.com",
    projectId: "fotoflow-dev",
    storageBucket: "fotoflow-dev.appspot.com",
    messagingSenderId: "180761954293",
    appId: "1:180761954293:web:2756c328ad6f8d792e82bc",
    measurementId: "G-HMJWHV4W3X"
  };
  
  
initializeApp(firebaseConfig);
  
  const StorageExample = () => {
    const [files, setFiles] = useState([]);
    const [totalUploadProgress, setTotalUploadProgress] = useState(0);
    const [imageUrls, setImageUrls] = useState([]);

    const handleFileInputChange = (event) => {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    };
  
    const uploadFileWithProgress = async (file, onProgress) => {
      const storage = getStorage();
      connectStorageEmulator(storage, "172.20.10.3", 9199);
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate progress percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // Upload completed successfully
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at:", downloadURL);
            setImageUrls((prevImageUrls) => [...prevImageUrls, downloadURL]); // Add the download URL to the state
          });
        }
      );
    };
  
    const handleUpload = () => {
      if (!Array.isArray(files) || files.length === 0) {
        console.error("No files selected for upload.");
        return;
      }
  
      let totalProgress = 0;
  
      const onProgress = (progress) => {
        totalProgress += progress;
        setTotalUploadProgress(totalProgress / files.length);
      };
  
      files.forEach((file) => {
        uploadFileWithProgress(file, onProgress);
      });
  
      setFiles([]);
    };
  
    useEffect(() => {
      // Reset the total upload progress when files change
      setTotalUploadProgress(0);
    }, [files]);
  
    return (
      <div>
        <h1>Upload Files to Firebase Cloud Storage</h1>
        <input type="file" multiple onChange={handleFileInputChange} />
        <button onClick={handleUpload}>Upload</button>
        <div>
          {totalUploadProgress > 0 && (
            <p>Total Upload Progress: {totalUploadProgress.toFixed(2)}%</p>
          )}
        </div>
        <div>
          {imageUrls.length > 0 &&
            imageUrls.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Image ${index}`} />
            ))}
        </div>
        
      </div>
    );
  };
  
  export default StorageExample;
  