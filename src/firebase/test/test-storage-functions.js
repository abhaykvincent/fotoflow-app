import { storage } from '../app';
import { v4 as uuidv4 } from 'uuid';

// Function to upload a single file to Firebase Storage

 function uploadSingleFile(file) {
    // Generate a UUID for the storage reference
    var uuid = uuidv4();

    // Create a storage reference with the UUID
    var storageRef = storage.ref(`test-${uuid}/${file.name}`);

    // Create a child reference with the UUID
    var fileRef = storageRef.child(uuid);

    // Upload the file to the storage reference
    var uploadTask = fileRef.put(file);

    // Return a promise to handle success or failure
    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            null,
            reject,
            () => {
                // Get the download URL of the uploaded file
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

// Function to upload multiple files to Firebase Storage
export function uploadMultipleFiles(files) {
    var uploadPromises = [];

    // Iterate over each file and upload it
    files.forEach((file) => {
        uploadPromises.push(uploadSingleFile(file));
    });

    // Return a promise to handle success or failure of all uploads
    return Promise.all(uploadPromises);
}
