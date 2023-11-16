import {
    uploadBytes,
    getDownloadURL,
    list,
    listAll,
    ref,
    deleteObject
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
  
  export const uploadFile = (id, collectionId, file) => {
    const storageRef = ref(storage, `${id}/${collectionId}/${file.name}`);
    uploadBytes(storageRef, file);
  };
  
  export const handleUpload = (files, id, collectionId, setIsUploading, setTotalUploadProgress, fetchImageUrls, imageCache) => {
    console.log('handling upload');
  
    if (files.length === 0) {
      console.error("No files selected for upload.");
      return;
    }
  
    let filesUploaded = 0;
    const uploadPromises = files.map((file) => {
        return uploadFile( id, collectionId, file);
        console.log(file)
        filesUploaded++;
        setTotalUploadProgress((filesUploaded / files.length) * 100);
    });
  
    Promise.all(uploadPromises)
      .then(() => {
        console.log('ends Uploading');
        setTotalUploadProgress(100);
        setIsUploading(false);
      })
      .catch((error) => {
        console.error('Error during uploads:', error);
      });
  };

  export const deleteCollectionFromStorage = async (id, collectionId) => {
    const storageRef = ref(storage, `${id}/${collectionId}`);
    const listResult = await list(storageRef);

    for (const item of listResult.items) {
        await deleteObject(item);
    }
  }

  // stoage is in format project/collection/image
  export const deleteProjectFromStorage = async (projectId) => {
    try {
      const projectRef = ref(storage, projectId);
      const projectList = await list(projectRef);
  
      // Iterate through projectList prefixes (collections)
      for (const collectionRef of projectList.prefixes) {
        const collectionList = await list(collectionRef);
  
        // Iterate through images in each collection
        for (const imageRef of collectionList.items) {
          await deleteObject(imageRef);
          console.log('Image deleted successfully.');
        }
  
        // Delete the collection directory after deleting its contents
        await deleteObject(collectionRef);
        console.log('Collection directory deleted successfully.');
      }
  
      // Delete the project directory after deleting its contents
      await deleteObject(projectRef);
      console.log('Project directory deleted successfully.');
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  };
  