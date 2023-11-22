import {
    uploadBytes,
    getDownloadURL,
    list,
    listAll,
    ref,
    deleteObject
  } from "firebase/storage";
  import { storage } from '../firebase/app';
  
  export const fetchImageUrls = async (id, collectionId, setImageUrls, page, pageSize) => {
    console.log(`Fetching images for page ${page}`);
    const storageRef = ref(storage, `${id}/${collectionId}`);
    const collectionImageUrls = [];

    try {
        // Calculate starting and ending indexes based on the page and page size
        const startAt = (page - 1) * pageSize;
        const endAt = startAt + pageSize;

        const listResult = await list(storageRef);

        let currentIndex = 0;
        for (const item of listResult.items) {
            if (currentIndex >= startAt && currentIndex < endAt) {
                const downloadURL = await getDownloadURL(item);
                collectionImageUrls.push(downloadURL);
            }

            currentIndex++;

            // Break the loop once endAt is reached
            if (currentIndex === endAt) break;
        }
        setImageUrls(collectionImageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }

    console.log('Fetching images FINISHED');
};
export const fetchImageInfo = async (id, collectionId) => {
  const storageRef = ref(storage, `${id}/${collectionId}`);
  const imageInfoList = [];

      const listResult = await list(storageRef);

      console.log(listResult)
      for (const item of listResult.items) {
          const downloadURL = await getDownloadURL(item);
          const imageName = item.name.split('/').pop(); // Extracting the image name

          // Pushing image info (name and empty status) into the list
          imageInfoList.push({
              name: imageName,
              isSelected: false 
          });
      }
  return imageInfoList;
};
  
  let filesUploaded = 0;
  export const uploadFile = (id, collectionId, file) => {
    const storageRef = ref(storage, `${id}/${collectionId}/${file.name}`);
  
    return new Promise((resolve, reject) => {
      uploadBytes(storageRef, file)
        .then((data) => {
          filesUploaded++;
          resolve(data); // Resolve the promise on successful upload
        })
        .catch((err) => {
          console.log(err);
          reject(err); // Reject the promise if there's an error
        });
    });
  };
  
  export const handleUpload = async (files, id, collectionId, setImageUrls, updateCollectionImages, batchSize = 3) => {
    console.log(`Uploading ${files.length} files`);
  
    if (files.length === 0) {
      console.error("No files selected for upload.");
      return;
    }
  
    const totalFiles = files.length;
    let currentIndex = 0;
  
    while (currentIndex < totalFiles) {
      const currentBatch = files.slice(currentIndex, currentIndex + batchSize);
      const uploadPromises = currentBatch.map(file => uploadFile(id, collectionId, file));
  
      try {
        const results = await Promise.all(uploadPromises);
        console.log('Batch uploaded successfully:', results.length, 'files');
  
        currentIndex += batchSize;
  
        // Perform necessary actions after each batch upload
        // For example, update the image URLs or perform other operations
        const imageInfoList = await fetchImageInfo(id, collectionId);
        await fetchImageUrls(id, collectionId, setImageUrls, 1, 15);
        await updateCollectionImages(id, collectionId, imageInfoList);
      } catch (error) {
        console.error('Error during batch uploads:', error);
        // Handle errors as needed
        // You might choose to retry failed uploads or implement a different error handling strategy
      }
    }
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
  