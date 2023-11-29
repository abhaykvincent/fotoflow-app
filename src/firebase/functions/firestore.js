
import { db } from "../app";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion} from "firebase/firestore";
import generateRandomString from "../../utils/generateRandomString";
import { deleteCollectionFromStorage, deleteProjectFromStorage } from "../../utils/storageOperations";



//Fetches
export const fetchProjects = async () => {
    const projectsCollection = collection(db, 'projects');
    const querySnapshot = await getDocs(projectsCollection);

    const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return projectsData
};
export const fetchProject = async (projectId) => {
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    const projectSnapshot = await getDoc(projectDoc);

    if (projectSnapshot.exists()) {
        return {
            id: projectSnapshot.id,
            ...projectSnapshot.data()
        };
    } else {
        throw new Error('Project does not exist.');
    }
};
export const fetchImages = async (projectId) => {
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    const projectSnapshot = await getDoc(projectDoc);

    if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data();
        const collections = projectData.collections;
        const images = collections.map((collection) => collection.uploadedFiles).flat();
        return images;
    } else {
        throw new Error('Project does not exist.');
    }
}

  
// Project Operations
export const addProject = async ({ name, type, ...optionalData }) => {
    if (!name || !type) {
    throw new Error('Project name and type are required.');
    }
    const id= `${name.toLowerCase().replace(/\s/g, '-')}-${generateRandomString(5)}`;
    const projectData = {id,name, type, ...optionalData,collections:[] };
    const projectsCollection = collection(db, 'projects');
    return setDoc(doc(projectsCollection, id), projectData)
    .then((dta) => {
        console.log(dta)
        return projectData
    } )
    .catch(error => {
        console.error('Error adding project:', error.message);
        throw error;
    });
};
export const deleteProjectFromFirestore = async (projectId) => {
    if (!projectId) {
      throw new Error('Project ID is required for deletion.');
    }
  
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
  
    try {
      const docSnapshot = await getDoc(projectDoc);
  
      if (docSnapshot.exists()) {
        await deleteDoc(projectDoc);
        console.log('Project deleted successfully.');
        deleteProjectFromStorage(projectId);
      } else {
        console.log('Document does not exist.');
        // Handle the case where the document doesn't exist
        throw new Error('Project does not exist.');
      }
    } catch (error) {
      console.error('Error deleting project:', error.message);
      throw error;
    }
  };
  
// Collection Operations

export const addCollectionToFirestore = async (projectId,collectionData) => {
    const {name,status} =collectionData;
    const id= `${name.toLowerCase().replace(/\s/g, '-')}-${generateRandomString(5)}`;

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    // Update the project with the new collection
    return updateDoc(projectDoc, {
        collections: arrayUnion({ id, name, status }), // Assuming collections is an array in your projectData
    })
    .then(() => {
        console.log('Collection added to project successfully.');
        return id
    })
    .catch((error) => {
        console.error('Error adding collection to project:', error.message);
        throw error;
    });
};

export const deleteCollectionFromFirestore = async (projectId, collectionId) => {
    if (!projectId || !collectionId) {
        throw new Error('Project ID and Collection ID are required for deletion.');
    }

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    try {
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
            const projectData = projectSnapshot.data();
            const updatedCollections = projectData.collections.filter(
                (collection) => collection.id !== collectionId
            );

            await updateDoc(projectDoc, { collections: updatedCollections });
            console.log('Collection deleted successfully.');
            deleteCollectionFromStorage(projectId, collectionId);
        } else {
            console.log('Project document does not exist.');
            throw new Error('Project does not exist.');
        }
    } catch (error) {
        console.error('Error deleting collection:', error.message);
        throw error;
    }
};

// Collection Image Operations
// add array of images to collection as selectedImages
export const addSelectedImagesToFirestore = async (projectId, collectionId, images,page,size) => {
    if (!projectId || !collectionId || !images) {
        throw new Error('Project ID, Collection ID, and Images are required.');
    }

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    try {
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
            const projectData = projectSnapshot.data();
            const updatedCollections = projectData.collections.map((collection) => {
                if (collection.id === collectionId) {
                    // Update the status of the corresponding image in the uploadedImages array
                    const updatedImages = collection.uploadedFiles.map((image) => {
                        if (page && size) {
                            const startIndex = (page - 1) * size;
                            const endIndex = page * size;
                            if (collection.uploadedFiles.indexOf(image) >= startIndex && collection.uploadedFiles.indexOf(image) < endIndex) {
                                if (images.includes(image.url)) {
                                    console.log('found');
                                    return {
                                        ...image,
                                        status: 'selected'
                                    };
                                } else {
                                    return {
                                        ...image,
                                        status: ''
                                    };
                                }
                            }
                            else{
                                return {
                                    ...image,
                                    status: ''
                                };
                            }
                        } 
                    });
                    console.log(updatedImages);
                    return {
                        ...collection,
                        uploadedFiles: updatedImages
                    };
                }
                return collection;
            });

            await updateDoc(projectDoc, { collections: updatedCollections });
            console.log('Selected images status updated successfully.');
        } else {
            console.log('Project document does not exist.');
            throw new Error('Project does not exist.');
        }
    } catch (error) {
        console.error('Error updating image status:', error.message);
        throw error;
    }
}