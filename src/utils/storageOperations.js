import {
    uploadBytesResumable,
    getDownloadURL,
    list,
    ref,
    deleteObject
} from "firebase/storage";
import { getDoc } from "firebase/firestore";
import { db, storage } from '../firebase/app';
import { collection, doc, updateDoc } from "firebase/firestore";
import { delay } from "./generalUtils";

 // Fetches image URLs from a specific storage location based on the provided parameters.
export const fetchImageUrlsBack = async (id, collectionId, page, pageSize) => {
    console.log(`Fetching images for page ${page}`);
    const storageRef = ref(storage, `${id}/${collectionId}`);
    try {
        const imageUrls = []; // Create an empty array to store the image URLs
    
        // Calculate starting and ending indexes based on the page and page size
        const startAt = (page - 1) * pageSize;
        const endAt = startAt + pageSize;

        const listResult = await list(storageRef);

        let currentIndex = 0;
        for (const item of listResult.items) {
            if (currentIndex >= startAt && currentIndex < endAt) {
                await new Promise((resolve) => setTimeout(resolve, 10)); // Add a delay of 10 milliseconds
                const downloadURL = await getDownloadURL(item);
                imageUrls.push(downloadURL);
            }

            currentIndex++;
            // Break the loop once endAt is reached
            if (currentIndex === endAt) break;
        }

        return imageUrls; // Return the array of image URLs
    } catch (error) {
        console.error("Error fetching images:", error);
    }
    console.log('Fetching images FINISHED');
};
export const fetchImageUrls = async (id, collectionId, setImageUrls, page, pageSize) => {
    console.log(`Fetching images for page ${page}`);
    const storageRef = ref(storage, `${id}/${collectionId}`);
    try {
        const imageUrls = []; // Create an empty array to store the image URLs
    
        // Calculate starting and ending indexes based on the page and page size
        const startAt = (page - 1) * pageSize;
        const endAt = startAt + pageSize;

        const listResult = await list(storageRef);

        let currentIndex = 0;
        for (const item of listResult.items) {
            if (currentIndex >= startAt && currentIndex < endAt) {
                //await new Promise((resolve) => setTimeout(resolve, 10)); // Add a delay of 10 milliseconds
                const downloadURL = await getDownloadURL(item);
                imageUrls.push(downloadURL);
            }

            currentIndex++;
            // Break the loop once endAt is reached
            if (currentIndex === endAt) break;
        }
        console.log(imageUrls.length)
        setImageUrls(imageUrls); // Set the image URLs outside the loop
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

// File upload function
export const uploadFile = (id, collectionId, file) => {
    const MAX_RETRIES = 5;
    const INITIAL_RETRY_DELAY = 500; // 1 second initial delay
    let retries = 0;

    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `${id}/${collectionId}/${file.name}`);
        let uploadTask;

        try {
            console.log(`Uploading ${file.name}...`)
            uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.error(`Error during initial upload for ${file.name}:`, error);
                    retries++;
                    try{
                     retryUpload(); // Initiate the retry mechanism
                    }
                    catch(error) {
                        console.error(`Error during retry upload for ${file.name}:`, error);
                        return reject(error); // Reject the promise with final error
                    }
                },
                async () => {
                    // Handle successful uploads on complete 
                    console.log(`%c ${file.name} File uploaded successfully in the first try`, 'color:green');
                    let url = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log(`Download URL for ${file.name}: ${url}`);
                    resolve({
                        name: file.name,
                        url
                    }); // Resolve the promise when the file is successfully uploaded
                }
            );
        } catch (error) {
            console.error("Error uploading file:", error);
            return reject(error); // Reject the promise with the error  
        }


        async function retryUpload() {
            uploadTask.cancel(); // Cancel the current upload task

            if (retries < MAX_RETRIES) {
                let retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retries); // Exponential backoff

                console.log(`Retrying upload of ${file.name} in ${retryDelay / 1000} seconds`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));

                uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    () => {},
                    async (error) => {
                            console.error(`Error during upload retry for ${file.name}:`, error);
                            retries++;
                            await retryUpload(); // Initiate the retry mechanism
                        },
                        async () => {
                            console.log(`%c ${file.name} File uploaded successfully on ${retries + 1} retry`, 'color:yellow');
                            let url = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve({
                                name: file.name,
                                url
                            });
                        }
                );
            } else {
                console.log(`==========================`);
                console.log(`%c ${file.name} File upload failed after ${MAX_RETRIES} retries`, 'color:red');
                console.log(`==========================`);
                reject(new Error(`Exceeded maximum retries (${MAX_RETRIES}) for ${file.name}`));
            }
        }

        
    });
};
    
export const handleUpload = async (files, id, collectionId, showAlert, retries = 2) => {
    console.log('%c ' + files.length + ' files to upload', 'color:yellow')
    let uploadPromises = [];

    // Slice the files array into smaller arrays of size sliceSize
    const sliceSize = 20;
    const sliceUpload = async (slice) => {
        const results = [];

        // add a new concole to result

        for (const file of slice) {
            try {
                await console.log(file.name)
                const result = await uploadFile(id, collectionId, file);
                results.push(result);
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
            }
        }
        return results;
    };
    // Upload the slices sequentially

    for (let i = 0; i < files.length; i += sliceSize) {
        const slice = files.slice(i, i + sliceSize);

        uploadPromises.push(sliceUpload(slice));
        // Add a delay after each slice (1 second in this example)
        if (slice[0]) await delay(100)
    }
    // console length of each slice in upload promises

    console.log('Promises:')
    console.log(uploadPromises)
    return Promise.all(uploadPromises)
        .then((results) => {
            let failedFiles = [];
            let uploadedFiles = [];
            // results is an array of arrays with objects
            // convert all objects  to single array
            results = [].concat(...results);
            console.log(results)
            debugger
            results.forEach((result, index) => {
                if (result.status === 'rejected')
                    failedFiles.push(files[index]);
                else
                    uploadedFiles.push(result); // Flatten the array
            });

            if (failedFiles.length == 0) {
                console.log("%c All files uploaded successfully!", 'color:green');

                addUploadedFilesToFirestore(id, collectionId, uploadedFiles)
                    .then(() => {
                        showAlert('success', 'All files uploaded successfully!')
                    })
                    .catch((error) => {
                        console.error('Error adding uploaded files to project:', error.message);
                        showAlert('error', error.message)
                        throw error;
                    });
                return uploadedFiles;
            } else {
                console.log("Some files failed to upload. Reuploading missed files...");
                return handleUpload(failedFiles, id, collectionId, retries - 1);
            }
        })
        .catch((error) => {
            console.error("Error uploading files:", error);
            throw error; // Propagate the error if needed
        });
}


  
// function to add uploadedFiles data to firestore in project of project id and collection of collection id
export const addUploadedFilesToFirestore = async (projectId, collectionId, uploadedFiles) => {
    console.log(projectId, collectionId, uploadedFiles)
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
  