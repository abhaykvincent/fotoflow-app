import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProject, addSelectedImagesToFirestore } from '../../firebase/functions/firestore';
import SelectionGallery from '../../components/ImageGallery/SelectionGallery';
import PaginationControl from '../../components/PaginationControl/PaginationControl';
import './Selection.scss';
export default function Selection() {
  let { projectId, collectionId } = useParams();
  const [project, setProject] = useState();
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagesInCollection, setSelectedImagesInCollection] = useState([]);
  const [page,setPage]=useState(1);
  const [size,setSize]=useState(15);
  const [totalPages, setTotalPages] = useState(0);
  collectionId = collectionId || project?.collections[0]?.id;
  // Set body color to white
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
  }, []);

  // Fetch project and image URLs
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  // Update images when project or collectionId changes
  useEffect(() => {
    if(!project) return
    const newImages = project?.collections.find((collection)=>collection.id===collectionId)?.uploadedFiles;
    setImages(newImages);
    setTotalPages(Math.ceil(newImages.length/size))
    setPage(1)
  }, [project, collectionId]);

  // Paginate images
  const paginatedImages = useMemo(() => {
    let imagesTemp = images
    return imagesTemp.slice((page-1)*size,page*size);
  }, [images, page]);
useEffect(() => {
  const photosDiv = document.querySelector('.gallary');
  if (photosDiv) {
    photosDiv.scrollTop = 0;
  }
}, [page]);


  // Fetch project data
  const fetchProjectData = async () => {
    try {
      const projectData = await fetchProject(projectId);
      setProject(projectData);
      // get all images url with status 'selected' from projectData as set
      const selectedImagesInFirestore = []
      projectData.collections.forEach((collection) => {
        collection.uploadedFiles.forEach((image) => {
          if (image.status === 'selected') {
            selectedImagesInFirestore.push(image.url);
          }
        });
      });
      console.log(selectedImagesInFirestore)
      setSelectedImages(selectedImagesInFirestore)
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  // Handle add selected images
  const handleAddSelectedImages = async () => {
    try {
      console.log('selectedImagesInCollection',selectedImagesInCollection)
      console.log('selectedImages',selectedImages)
      await addSelectedImagesToFirestore(projectId, collectionId, selectedImages,page,size);
      // handle success (e.g. show a success message)
    } catch (error) {
      console.error('Failed to add selected images:', error);
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
    <div className="select-project">
      <div className="project-header" style={{ backgroundImage: `url(${images[0]?images[0].url:''})`}}>
        <div className="project-info">
          <h1 className='projet-name'>{project.name}</h1>
          <p>10th October, 2023</p>
          <CollectionsPanel/>
        </div>
        <div className="banner" />
      </div>
      <div className="shared-collection">
        <SelectionGallery images={paginatedImages} {...{selectedImages,setSelectedImages,setSelectedImagesInCollection}} />
        <PaginationControl
          currentPage={page}
          totalPages={totalPages}
          handlePageChange={(newPage) => {
            saveSelectedImages()
            setPage(newPage)
          }}
        />
      </div>
    </div>
  );

  function saveSelectedImages() {
    handleAddSelectedImages()
    selectedImages.forEach((image) => selectedImagesInCollection.push(image))
  }
}