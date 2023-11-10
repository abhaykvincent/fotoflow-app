
import { db } from "../app";
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, arrayUnion} from "firebase/firestore";
import generateRandomString from "../../utils/generateRandomString";

export const fetchProjects = async () => {
    const projectsCollection = collection(db, 'projects');
    const querySnapshot = await getDocs(projectsCollection);

    const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return projectsData
};
  
export const addProject = async ({ name, type, ...optionalData }) => {
    if (!name || !type) {
    throw new Error('Project name and type are required.');
    }
    const id= `${name.toLowerCase().replace(/\s/g, '-')}-${generateRandomString(5)}`;
    const projectData = {id,name, type, ...optionalData,collections:[] };
    const projectsCollection = collection(db, 'projects');
    return setDoc(doc(projectsCollection, id), projectData)
    .then(() => projectData )
    .catch(error => {
        console.error('Error adding project:', error.message);
        throw error;
    });
};

const updateProject = async (projectId, updatedData) => {
};

export const deleteProjectFromFirestore = async (projectId) => {
    if (!projectId) {
      throw new Error('Project ID is required for deletion.');
    }
  
    const projectsCollection = collection(db, 'projects');
    const projectDoc = doc(projectsCollection, projectId);
  
    return deleteDoc(projectDoc)
      .then(() => {
        console.log('Project deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting project:', error.message);
        throw error;
      });
  };
  

// COLLECTION

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

const updateCollection = async (collectionId, updatedData) => {
    try {
        if (!collectionId) {
            throw new Error('Collection ID is required.');
        }

        await db.collection('collections').doc(collectionId).update(updatedData);
        console.log('Collection updated successfully');
    } catch (error) {
        console.error('Error updating collection:', error.message);
        throw error;
    }
};

const deleteCollection = async (collectionId) => {
    try {
        if (!collectionId) {
            throw new Error('Collection ID is required.');
        }

        await db.collection('collections').doc(collectionId).delete();
        console.log('Collection deleted successfully');
    } catch (error) {
        console.error('Error deleting collection:', error.message);
        throw error;
    }
};

