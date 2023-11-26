import {
    uploadBytesResumable,
    getDownloadURL,
    list,
    listAll,
    ref,
    deleteObject
  } from "firebase/storage";
import { getDoc } from "firebase/firestore";
  import { db, storage } from '../firebase/app';
import { arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
  
export const fetchImageUrls = async (id, collectionId, setImageUrls, page, pageSize) => {
    console.log(`Fetching images for page ${page}`);
    const storageRef = ref(storage, `${id}/${collectionId}`);

    try {
        setImageUrls([]); // Clear the imageUrls array
    
        // Calculate starting and ending indexes based on the page and page size
        const startAt = (page - 1) * pageSize;
        const endAt = startAt + pageSize;

        const listResult = await list(storageRef);

        let currentIndex = 0;
        for (const item of listResult.items) {
            if (currentIndex >= startAt && currentIndex < endAt) {
                await new Promise((resolve) => setTimeout(resolve, 10)); // Add a delay of 500 milliseconds
                const downloadURL = await getDownloadURL(item);
                setImageUrls((prev) => [...prev, downloadURL]);
            }

            currentIndex++;
            // Break the loop once endAt is reached
            if (currentIndex === endAt) break;
        }
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
  
    const MAX_RETRIES = 5;
    const INITIAL_RETRY_DELAY = 500; // 1 second initial delay
    let retries = 0;
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `${id}/${collectionId}/${file.name}`);
            
        let uploadSuccessful = false;
        let uploadTask = uploadBytesResumable(storageRef, file);

        function  retryUpload() {

            uploadTask.cancel(); // Cancel the current upload task
            
                let retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retries); // Exponential backoff

                console.log(`Retrying upload of ${file.name} in ${retryDelay / 1000} seconds`);
                setTimeout(() => {
                    uploadTask = uploadBytesResumable(storageRef, file);
                    //upload successful
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                        },
                        (error) => {
                        // Handle unsuccessful uploads
                        }, 
                        async() => {
                            console.log(`%c ${file.name} File uploaded successfully on ${retries+1} retry` ,'color:yellow');
                            uploadSuccessful = true;
                            let url=await getDownloadURL(uploadTask.snapshot.ref)
                            resolve({name:file.name,url});

                        })
                    setTimeout(() => {
                        uploadTask.on('canceled', (error) => {
                            if (retries < MAX_RETRIES && !uploadSuccessful) {
                            retries++;
                            console.log(`${file.name} %c canceled`, 'color:red');
                            uploadSuccessful = false;
                            retryUpload(); // Initiate the retry mechanism
                            } else {
                                console.log(`==========================`);
                                console.log(`%c ${file.name} File upload failed` ,'color:red');
                                console.log(`==========================`);
                                reject(new Error(`Exceeded maximum retries (${MAX_RETRIES}) for ${file.name}`));
                            }
                        });
            
                    }, 1000);
                    
                }, retryDelay);
            

            return uploadTask;
        }
        setTimeout(() => {
            uploadTask.on('canceled', (error) => {
                console.log(`${file.name} %c canceled`, 'color:red');
                uploadSuccessful = false;
                retryUpload(); // Initiate the retry mechanism
            });

        }, 1000);
        uploadTask.on('state_changed', 
        (snapshot) => {
        },
        null, 
        async () => {
            // Handle successful uploads on complete
            console.log(`%c ${file.name} File uploaded successfully in first try`, 'color:green');
            uploadSuccessful = true;
            let url=await getDownloadURL(uploadTask.snapshot.ref)
            resolve({name:file.name,url}); // Resolve the promise when the file is successfully uploaded
        }
      );
       
    });
  };
  
  export const handleUpload = async (files, id, collectionId, retries=2) => {
      let uploadPromises = [];
    console.log('%c '+files.length+' files to upload','color:yellow')
      files.forEach((file) => {
          uploadPromises.push(uploadFile(id, collectionId,file));
      });
  
      return Promise.allSettled(uploadPromises)
      .then((results) => {
          let failedFiles = [];
          let uploadedFiles = [];
          results.forEach((result, index) => {
              if (result.status === 'rejected') {
                  failedFiles.push(files[index]);
              }
              else {
                uploadedFiles.push(result.value)
              }
          });

          if (failedFiles.length > 0) {
              console.log("Some files failed to upload. Reuploading missed files...");
              return handleUpload(failedFiles, id, collectionId, retries-1);
          } else {
              console.log("%c All files uploaded successfully!", 'color:green');
              // addUploadedFilesToFirestore
              addUploadedFilesToFirestore(id, collectionId, uploadedFiles)
              .then(() => {
                  console.log('Uploaded files added to project successfully.');
              })
              .catch((error) => {
                  console.error('Error adding uploaded files to project:', error.message);
                  throw error;
              });
              return uploadedFiles;
          }

      })
   
      .catch((error) => {
          console.error("Error uploading files:", error);
          throw error; // Propagate the error if needed
      });
  }
  
  // function to add uploadedFiles data to firestore in project of project id and collection of collection id
    export const addUploadedFilesToFirestore = async (projectId, collectionId, uploadedFiles) => {
        const projectsCollection = collection(db, 'projects');
        const projectDoc = doc(projectsCollection, projectId);

        // Get the project document
        const projectData = await getDoc(projectDoc);

        if (projectData.exists()) {
            // Read the collections array
            const collections = projectData.data().collections;

            // Find the collection with the given id
            const collection = collections.find(collection => collection.id === collectionId);

            if (collection) {
                // Check if uploadedFiles property exists in the collection
                if (!collection.uploadedFiles) {
                    collection.uploadedFiles = []; // Initialize uploadedFiles array if it doesn't exist
                }

                // Append the new uploadedFiles to the collection's uploadedFiles array
                collection.uploadedFiles.push(...uploadedFiles);

                // Update the project document with the new collections array
                return updateDoc(projectDoc, { collections })
                    .then(() => {
                        console.log('Uploaded files added to collection successfully.');
                    })
                    .catch((error) => {
                        console.error('Error adding uploaded files to collection:', error.message);
                        throw error;
                    });
            } else {
                console.error('Collection not found.');
                throw new Error('Collection not found.');
            }
        } else {
            console.error('Project not found.');
            throw new Error('Project not found.');
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
  