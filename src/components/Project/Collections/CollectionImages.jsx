import React, {useState, useEffect} from 'react';
import { fetchImageUrls, handleUpload } from '../../../utils/storageOperations';
import ImageGallery from '../../ImageGallery/ImageGallery';
import { fetchImages } from '../../../firebase/functions/firestore';
import { addAllFileSizesToMB } from '../../../utils/fileUtils';

const CollectionImages = ({ id, collectionId,collection,showAlert }) => {
// Files
const [files, setFiles] = useState([]);
const [collectionImages, setCollectionImages] = useState([]);
const [imageUrls, setImageUrls] = useState([]);
const [selectedImages, setSelectedImages] = useState([]);
const [isPhotosImported, setIsPhotosImported] = useState(false);
//import size
const [importFileSize, setImportFileSize] = useState();
const [showAllPhotos,setShowAllPhotos]=useState(true);
const [page,setPage]=useState(1);
const [size,setSize]=useState(15);
// add project images when started from fetchImages
useEffect(()=>{
    console.log(id,collectionId)
    setShowAllPhotos(true)
    //get images from 
    fetchImages(id,collectionId)
    .then((images)=>{
        setCollectionImages(images)
    })
    .catch((error)=>{
    console.log(error)
    })
},[collectionId])
// Fetch Images
useEffect(() => {
    if(!collectionImages){

        setImageUrls([])
        return
    } 
    let start=(page-1)*size;
    let end=page*size;
    let images=collectionImages.slice(start,end)
    setImageUrls(images)
    // loop through collectionImages and if image status is selected update imageUrls
    setSelectedImages(collectionImages.filter((image)=>image.status==='selected'))
}, [collectionImages,page]);

useEffect(() => {
    setPage(1)
    if(showAllPhotos){
        let start=(page-1)*size;
        let end=page*size;
        let images=collectionImages.slice(start,end)
    setImageUrls(images)
    }
    else{
    setImageUrls(selectedImages)
    }
}, [showAllPhotos,collectionImages]);

const handleFileInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setIsPhotosImported(true);
    setFiles(selectedFiles);
    setImportFileSize(addAllFileSizesToMB(selectedFiles))
    setImageUrls(selectedFiles)
};
return (
    <div className="project-collection">
        <div className="header">
            <div className="label"><h3>{collection.name}</h3></div>

                {
                    collectionImages?.length>0?
                    <div className="view-control">
                        <div className="control-label label-all-photos">{collectionImages.length} Photos</div>
                        <div className="control-wrap">
                            <div className="controls">
                                <div className={`control ${showAllPhotos ? 'active' : ''}`} onClick={() => setShowAllPhotos(true)}>All photos</div>
                                <div className={`control ${!showAllPhotos ? 'active' : ''}`} onClick={() => setShowAllPhotos(false)}>Selected</div>
                            </div>
                            <div className={`active`}></div>
                        </div>
                        <div className="control-label label-selected-photos">{selectedImages.length} Photos</div>
                    </div>:
                    <div className="empty-message">
                        <p>Import shoot photos to upload </p>
                    </div>
                }

                <div className="options">
                    <label htmlFor="fileInput" className={`button ${isPhotosImported ? 'secondary' : 'primary'}`} 

                    >Import Images</label>
                    <input id='fileInput' type="file" multiple onChange={handleFileInputChange} />
                    <div className={`button ${isPhotosImported ? 'primary' : 'secondary disabled'}`} 
                        onClick={async()=>{
                            setIsPhotosImported(false);
                            let uploadedImages=await handleUpload(files, id, collectionId,importFileSize,showAlert)
                            console.log(uploadedImages)
                            setImageUrls(uploadedImages)
                        }}
                        >Upload Images</div>
                </div>

        </div>
        {
            imageUrls.length > 0 ?
            <ImageGallery {...{isPhotosImported, imageUrls, projectId:id}}/>:''
        }
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
                        setPage(page+1)
                    }
                }
            >Next</div>

        </div>
    </div>
    );
};

export default CollectionImages;