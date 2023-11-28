import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchImageUrls } from '../../utils/storageOperations';
import { findCollectionById } from '../../utils/CollectionQuery';
import { fetchProject } from '../../firebase/functions/firestore';
import SelectionGallery from '../../components/ImageGallery/SelectionGallery';
import { addSelectedImagesToFirestore } from '../../firebase/functions/firestore';
import './Selection.scss';

export default function Selection() {
  // set body color to white
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
  }, []);
  // Get project from fetchProject and store in state
  let { projectId, collectionId } = useParams();
  const [project, setProject] = useState();
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
  // selected images in page
  const [selectedImages, setSelectedImages] = useState(new Set());
  // selected images in collection
  const [selectedImagesInCollection, setSelectedImagesInCollection] = useState([]);
  const [page,setPage]=useState(1);
  const [size,setSize]=useState(15);

  // if no collectionIs is passed, use the first collectionId
  collectionId  = collectionId || project?.collections[0]?.id
  // Fetch Images based on projectId and collectionId
  useEffect(() => {
    console.log(projectId, collectionId)
    const fetchProjectData = async () => {
      try {
        const projectData = await fetchProject(projectId);
        console.log(projectData)
        setProject(projectData);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProjectData();
    fetchImageUrls(projectId, collectionId, setImageUrls, page, size);
  }, [projectId, collectionId,page]);

  useEffect(() => {
    setPage(1)
  }, [collectionId]);

  useEffect(() => {
    if(!project) return
    setImages(project?.collections.find((collection)=>collection.id===collectionId)?.uploadedFiles.slice((page-1)*size,page*size))
  }, [project]);

useEffect(() => {
  const newSelectedImages = new Set(selectedImages);
  selectedImagesInCollection.forEach((image) => {
    if (imageUrls.includes(image)) {
      newSelectedImages.add(image);
    }
  });
  setSelectedImages(newSelectedImages);
}, [selectedImagesInCollection, imageUrls]);
  if(!project) return

  
  // Collections panel
  const CollectionsPanel = () => {
    return (
      <div className="collections-panel">
        {
          project.collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`collection-tab ${collection.id === collectionId || (!collectionId && index === 0) ? 'active' : ''}`}
            >
              <Link to={`/selection/${project.id}/${collection.id}`}>{collection.name}</Link>
            </div>
          ))
        }
      </div>
    );
  };
  // inside Selection component
  const handleAddSelectedImages = async () => {
    const selectedImagesArray = Array.from(selectedImages);
    try {
      await addSelectedImagesToFirestore(projectId, collectionId, selectedImagesArray);
      // handle success (e.g. show a success message)
    } catch (error) {
      // handle error (e.g. show an error message)
    }
  };
  return (
    <div className="share-project">
      <div className="project-header"
      style={{ backgroundImage: `url(${images[0]?images[0].url:''})`}}
      >
        <div className="project-info">

        <h1 className='projet-name'>{project.name}</h1>
        <p>10th October, 2023</p>
        <CollectionsPanel/>
        </div>
        <div className="banner" >

        </div>
      </div>
        <div className="shared-collection">
          <SelectionGallery images={images} {...{selectedImages,setSelectedImages,selectedImagesInCollection}} />

        <div className="pagination">
          <div className={`button ${page===1?'disabled':'primary'} previous`}
            onClick={
              ()=>{
                if(page>1)
                  setPage(page-1)
              }
            }
          >Previous</div>
          <div className="button primary next"
            onClick={
              ()=>{
                handleAddSelectedImages(selectedImages)
                //push selected images to selectedImagesInCollection
                selectedImages.forEach((image)=>{
                  selectedImagesInCollection.push(image)
                })
                console.log(selectedImages)
                setPage(page+1)
              }
            }
          >Next</div>

        </div>
        </div>
    </div>
  );
}
