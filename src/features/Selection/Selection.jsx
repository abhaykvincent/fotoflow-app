import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchImageUrls } from '../../utils/storageOperations';
import { fetchProject, addSelectedImagesToFirestore } from '../../firebase/functions/firestore';
import SelectionGallery from '../../components/ImageGallery/SelectionGallery';
import './Selection.scss';

export default function Selection() {
  let { projectId, collectionId } = useParams();
  const [project, setProject] = useState();
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [selectedImagesInCollection, setSelectedImagesInCollection] = useState([]);
  const [page,setPage]=useState(1);
  const [size,setSize]=useState(15);
  collectionId = collectionId || project?.collections[0]?.id;
  // Set body color to white
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
  }, []);

  // Fetch project and image URLs
  useEffect(() => {
    fetchProjectData();
  }, [projectId, collectionId, page]);

  // Reset page when collectionId changes
  useEffect(() => {
    setPage(1)
  }, [collectionId]);

  // Update images when project changes
  useEffect(() => {
    if(!project) return
    setImages(project?.collections.find((collection)=>collection.id===collectionId)?.uploadedFiles.slice((page-1)*size,page*size))
  }, [project]);


  // Fetch project data
  const fetchProjectData = async () => {
    try {
      const projectData = await fetchProject(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  // Handle add selected images
  const handleAddSelectedImages = async () => {
    const selectedImagesArray = Array.from(selectedImages);
    try {
      await addSelectedImagesToFirestore(projectId, collectionId, selectedImagesArray);
      // handle success (e.g. show a success message)
    } catch (error) {
      // handle error (e.g. show an error message)
    }
  };

  // Collections panel
  const CollectionsPanel = () => (
    <div className="collections-panel">
      {project.collections.map((collection, index) => (
        <div
          key={collection.id}
          className={`collection-tab ${collection.id === collectionId || (!collectionId && index === 0) ? 'active' : ''}`}
        >
          <Link to={`/selection/${project.id}/${collection.id}`}>{collection.name}</Link>
        </div>
      ))}
    </div>
  );

  if(!project) return null;

  return (
    <div className="share-project">
      <div className="project-header" style={{ backgroundImage: `url(${images[0]?images[0].url:''})`}}>
        <div className="project-info">
          <h1 className='projet-name'>{project.name}</h1>
          <p>10th October, 2023</p>
          <CollectionsPanel/>
        </div>
        <div className="banner" />
      </div>
      <div className="shared-collection">
        <SelectionGallery images={images} {...{selectedImages,setSelectedImages,setSelectedImagesInCollection}} />
        <div className="pagination">
          <div className={`button ${page===1?'disabled':'primary'} previous`} onClick={() => page > 1 && setPage(page-1)}>Previous</div>
          <div className="button primary next" onClick={() => handleNextClick()}>Next</div>
        </div>
      </div>
    </div>
  );

  function handleNextClick() {
    handleAddSelectedImages(selectedImages)
    selectedImages.forEach((image) => selectedImagesInCollection.push(image))
    setPage(page+1)
  }
}