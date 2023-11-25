import { storage } from '../app';
import { v4 as uuidv4 } from 'uuid';
import {
    getDownloadURL,
    ref,
    uploadBytesResumable
} from "firebase/storage";

// Function to upload a single file to Firebase Storage
function uploadSingleFile(folder, file) {

    const MAX_RETRIES = 2;
    const INITIAL_RETRY_DELAY = 1000; // 1 second initial delay
    let retries = 0;
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `test2/${file.name}`);
        
        let uploadTask = uploadBytesResumable(storageRef, file);

        function retryUpload() {
            uploadTask.cancel(); // Cancel the current upload task

            if (retries < MAX_RETRIES) {
                retries++;
                let retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retries); // Exponential backoff

                console.log(`Retrying upload of ${file.name} in ${retryDelay / 1000} seconds`);
                setTimeout(() => {
                    uploadTask = uploadBytesResumable(storageRef, file);
                    retryUpload();
                }, retryDelay);
            } else {
                reject(new Error(`Exceeded maximum retries (${MAX_RETRIES}) for ${file.name}`));
            }
        }
        
        uploadTask.on('state_changed',  
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //if progress is 100% console it in green
                if(progress === 0){
                    console.log(`${file.name} %c 0%`,'color:yellow')
                }
                if(progress === 100){
                    console.log(`${file.name} %c 100%`,'color:green')
                }
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.log("Error uploading file:", error);
                reject(error); // Reject the promise if there's an error
            }, 
            () => {
                // Handle successful uploads on complete
                console.log(`${file.name} File uploaded successfully`);
                resolve(); // Resolve the promise when the file is successfully uploaded
            }
        );
        setTimeout(() => {
            uploadTask.on('canceled', (error) => {
                console.log(`${file.name} %c canceled`, 'color:red');
    
                retryUpload(); // Initiate the retry mechanism
            });
         }, 1000);
    });
}

// Function to upload multiple files to Firebase Storage
export function uploadMultipleFiles(files) {
    const uuid = uuidv4();
    let uploadPromises = [];
    
    files.forEach((file) => {
        uploadPromises.push(uploadSingleFile(uuid, file));
    });

    return Promise.allSettled(uploadPromises)
        .then((results) => {
            let failedFiles = [];
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    failedFiles.push(files[index]);
                }
            });

            if (failedFiles.length > 0) {
                console.log("Some files failed to upload. Reuploading missed files...");
                return uploadMultipleFiles(failedFiles);
            } else {
                console.log("All files uploaded successfully!");
                return results.map((result) => result.value); // Resolve with download URLs if needed
            }
        })
        .catch((error) => {
            console.error("Error uploading files:", error);
            throw error; // Propagate the error if needed
        });
}
