import {
    uploadBytesResumable,
    getDownloadURL,
    list,
    ref,
  } from "firebase/storage";
  import { storage } from '../firebase/app';
  
  export const fetchImageUrls = async (id, collectionId, setImageUrls) => {
    console.log('Fetching images');
    const storageRef = ref(storage, `${id}/${collectionId}`);
    const collectionImageUrls = [];

    try {
        const listResult = await list(storageRef);

        for (const item of listResult.items) {
            const downloadURL = await getDownloadURL(item);
            console.log(downloadURL);
            collectionImageUrls.push(downloadURL);
        }

        setImageUrls(collectionImageUrls);
    } 
    catch (error) {
        console.error("Error fetching images:", error);
    }
  
    console.log('Fetching images FINISHED');
  };
  
  export const uploadFileWithProgress = (id, collectionId, file, onProgress) => {
    const storageRef = ref(storage, `${id}/${collectionId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at:", downloadURL);
        }
      );
    });
  };
  
  export const handleUpload = (files, setIsUploading, setTotalUploadProgress, fetchImageUrls, imageCache, collectionId) => {
    console.log('handling upload');
  
    if (files.length === 0) {
      console.error("No files selected for upload.");
      return;
    }
  
    let filesUploaded = 0;
    setIsUploading(true);
    const uploadPromises = files.map((file) => {
      return new Promise((resolve) => {
        uploadFileWithProgress(file, (progress) => {
          if (progress === 100) {
            filesUploaded++;
            setTotalUploadProgress((filesUploaded / files.length) * 100);
            resolve();
          }
        });
      });
    });
  
    Promise.all(uploadPromises)
      .then(() => {
        console.log('ends Uploading');
        setTotalUploadProgress(100);
        setIsUploading(false);
        fetchImageUrls().then((collectionImageUrls) => {
          imageCache.current[collectionId] = collectionImageUrls;
        });
      })
      .catch((error) => {
        console.error('Error during uploads:', error);
      });
  };
  