import {
    uploadBytesResumable,
    getDownloadURL,
    list,
    ref,
    deleteObject
} from "firebase/storage";
import { getDoc, getDocs, setDoc } from "firebase/firestore";
import { db, storage } from '../firebase/app';
import { collection, doc, updateDoc } from "firebase/firestore";
import { delay } from "./generalUtils";
import { generateMemorablePIN } from "./stringUtils";


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
export const uploadFile = (id, collectionId, file,setUploadList) => {
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
                    //setUploadList aarraay of filee object  matches file.name with the progress of the upload
                    setUploadList((prevState) => {
                        return prevState.map((fileProgress) => {
                            if (fileProgress.name === file.name) {
                                return {
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                    status: 'uploading',
                                    // NO DEECIMAL POINTS
                                    progress: Math.round(progress)
                                }
                            }
                            return fileProgress;
                        })
                    })
                    
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
                    await setUploadList((prevState) => {
                        return prevState.map((fileProgress) => {
                            if (fileProgress.name === file.name) {
                                return {
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                    status:'uploaded',
                                    url
                                }
                            }
                            return fileProgress;
                        })
                    })
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
const sliceUpload = async (slice, id, collectionId,setUploadList) => {
    //update uploadList files that maatches current slice eaach files status as initializing
    setUploadList(prevState => {
        return prevState.map((file, index) => {
            console.log(file)
            console.log(slice)
            if (slice[index] && file.name === slice[index].name) {
                console.log('%c ' + file.name + ' file status changed to initializing', 'color:yellow');
                console.log(file)
                return {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    status: 'initializing'
                }
            }
            return file;
        })
    })
    const uploadPromises = slice.map(file => {
        return uploadFile(id, collectionId, file,setUploadList);
    });

    // Use Promise.all to initiate all file uploads simultaneously
    const results = await Promise.all(uploadPromises);
    console.log("!!!! inside slice", 'color:red');

    return results;
};


export const handleUpload = async (files, id, collectionId,importFileSize, setUploadList, showAlert, retries = 2) => {
    let uploadPromises = [];
    setUploadList(files)
    // Slice the files array into smaller arrays of size sliceSize
    const sliceSize = 5;
    console.log('%c ' + files.length + ' files to upload', 'color:yellow');
    let uploadedFiles = [];

    // Upload the slices sequentially
    for (let i = 0; i < files.length; i += sliceSize) {
        const slice = files.slice(i, i + sliceSize);

        try {

            

            const results = await sliceUpload(slice, id, collectionId,setUploadList);
            uploadedFiles.push(...results);
        } catch (error) {
            console.error("Error uploading files:", error);
            throw error; // Propagate the error if needed
        }

        // Add a delay after each slice (if needed)
        if (i + sliceSize < files.length) {
            await delay(100);
        }
    }
    console.log('Promises:')
    console.log(uploadedFiles)
    return Promise.all(uploadedFiles)
        .then((results) => {
            let failedFiles = [];
            let uploadedFiles = [];
            // results is an array of arrays with objects
            // convert all objects  to single array
            results = [].concat(...results);
            console.log(results)
            results.forEach((result, index) => {
                if (result.status === 'rejected')
                    failedFiles.push(files[index]);
                else
                    uploadedFiles.push(result); // Flatten the array
            });

            if (failedFiles.length == 0) {
                console.log("%c All files uploaded successfully!", 'color:green');

                addUploadedFilesToFirestore(id, collectionId,importFileSize, uploadedFiles)
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


  
// function to add uaddSelectedImagesToFirestoreploadedFiles data to firestore in project of project id and collection of collection id
export const addUploadedFilesToFirestore = async (projectId, collectionId,importFileSize, uploadedFiles) => {

    // Get a reference to the project document
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    // Get a reference to the collection document
    const subCollectionId = projectId+'-'+collectionId;
    const collectionDoc = doc(projectDoc, 'collections', subCollectionId);

    // Get the data from project document
    const projectData = await getDoc(projectDoc,subCollectionId);

    if (projectData.exists()) {
        // Update the project document with the new collections array
        return updateDoc(collectionDoc, { uploadedFiles })
            .then(() => {
                let projectCover= uploadedFiles[0].url
                // if project-cover doesent exixt
                console.log(projectData.data())
                console.log('Uploaded files added to collection successfully.');
                // update uploaded files count on project document
                return updateDoc(projectDoc, 
                    { uploadedFilesCount: projectData.data().uploadedFilesCount + uploadedFiles.length ,
                        totalFileSize:importFileSize+projectData.data().totalFileSize,
                        projectCover:projectCover,
                        status:"uploaded",
                        //pin:generateMemorablePIN(4)
                        //add pin if not exist
                        pin: projectData.data().pin ? projectData.data().pin : generateMemorablePIN(4)
                });
            })
            .then(() => {
                console.log('Uploaded files count updated successfully.');
            })
            .catch((error) => {
                console.error('Error adding uploaded files to collection:', error.message);
                throw error;
            });
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
  