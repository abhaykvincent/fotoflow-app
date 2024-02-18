
import { db } from "../app";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion} from "firebase/firestore";
import {generateRandomString} from "../../utils/stringUtils";
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

    const projectData = projectSnapshot.data();
    // loop through projectData.collections
    // for each collection, fetch collection data
    let collectionsData = [];
    projectData.collections = await Promise.all(projectData.collections.map(async (collection) => {
        const subCollectionId = projectId + '-' + collection.id;
        const collectionDoc = doc(projectDoc, 'collections', subCollectionId);
        const collectionSnapshot = await getDoc(collectionDoc);
    
        if (collectionSnapshot.exists()) {
            console.log(collectionSnapshot.data());
            return {...collection,...collectionSnapshot.data(),...{id:collection.id}};
        } else {
            throw new Error('Collection does not exist.');
        }
    }));
    

    return projectData;
};
export const fetchImages = async (projectId,collectionId) => {
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    const subCollectionId = projectId+'-'+collectionId;
    const collectionDoc = doc(projectDoc, 'collections', subCollectionId);
    const collectionSnapshot = await getDoc(collectionDoc);


    if (collectionSnapshot.exists()) {
        const collectionsData = collectionSnapshot.data();
        return collectionsData.uploadedFiles
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
    const projectData = {
        id,
        name,
        type, 
        ...optionalData};
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

    const collectionsCollection = collection(projectDoc, 'collections');
    const collectionDoc = {
        id : projectId+'-'+id,
    }

    // Update the project with the new collection
    return updateDoc(projectDoc, {
        collections: arrayUnion({ id, name, status }), // Assuming collections is an array in your projectData
    })
    .then(() => {
        // create new collection 
        setDoc(doc(collectionsCollection, collectionDoc.id), collectionDoc)
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
export const addSelectedImagesToFirestore = async (projectId, collectionId, images, page, size,totalPages) => {
    if (!projectId || !collectionId || !images) {
        throw new Error('Project ID, Collection ID, and Images are required.');
    }

    let status = page===totalPages? 'selected' : 'selecting';
    console.log(page,totalPages)
    console.log(status)
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
    const subCollectionId = projectId + '-' + collectionId;
    const collectionDoc = doc(projectDoc, 'collections', subCollectionId);
    try {
        const collectionSnapshot = await getDoc(collectionDoc);
        const collectionData = collectionSnapshot.data();

        if (collectionSnapshot.exists()) {

            const updatedImages = collectionData.uploadedFiles.map((image) => {
                const imageIndex = collectionData.uploadedFiles.indexOf(image);
                const startIndex = (page - 1) * size;
                const endIndex = page * size;

                if (imageIndex >= startIndex && imageIndex < endIndex) {
                    return {
                        ...image,
                        status: images.includes(image.url) ? 'selected' : ''
                    };
                } else {
                    return image; // retain the status if outside the page and size range
                }
            });



            await updateDoc(collectionDoc, {...collectionData,uploadedFiles:updatedImages});
            // update status on projeect
            const projectSnapshot = await getDoc(projectDoc);
            const projectData = projectSnapshot.data();
            
            await updateDoc(projectDoc, {...projectData, status: status});
            console.log('Selected images status updated successfully.');

        } else {
            console.log('Collection document does not exist.');
            throw new Error('Collection does not exist.');
        }
    } catch (error) {
        console.error('Error updating image status:', error.message);
        throw error;
    }
}
// Update project status
export const updateProjectStatusInFirestore = async (projectId, status) => {
    if (!projectId || !status) {
        throw new Error('Project ID and status are required.');
    }
    debugger

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    try {
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
            await updateDoc(projectDoc, { status: status });
            console.log('Project status updated successfully.');
        } else {
            console.log('Project document does not exist.');
            throw new Error('Project does not exist.');
        }
    } catch (error) {
        console.error('Error updating project status:', error.message);
        throw error;
    }
}
// Set cover photo
export const setCoverPhotoInFirestore = async (projectId, image) => {
    if (!projectId || !image) {
        throw new Error('Project ID and Image are required.');
    }

    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);

    try {
        const projectSnapshot = await getDoc(projectDoc);
        const projectData = projectSnapshot.data();

        if (projectSnapshot.exists()) {
            await updateDoc(projectDoc, { projectCover: image });
            console.log('Cover photo updated successfully.');
        } else {
            console.log('Project document does not exist.');
            throw new Error('Project does not exist.');
        }
    } catch (error) {
        console.error('Error updating cover photo:', error.message);
        throw error;
    }
}