import React, { useState, useEffect, useCallback, useRef } from 'react';

const ShareGallery = ({ images }) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const[loadedImages, setLoadedImages] = useState(images.slice(0, size));
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  console.log(images)
  useEffect(() => {
    setLoadedImages(images.slice(0, size));
  }, [images])

  const observer = useRef()
  const lastPhotoElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setLoadedImages(prevLoadedImages => {
          let newLoadedImages = [...prevLoadedImages];
          for (let i = 1; i <= size; i++) {
            if (prevLoadedImages.length + i <= images.length) {
              newLoadedImages.push(images[prevLoadedImages.length + i - 1]);
            }
          }
          setLoading(false);
          setHasMore(newLoadedImages.length < images.length);
          return newLoadedImages;
        });
      }
    })
    if (node) observer.current.observe(node)
  }, [loadedImages,images])
  return (
    <div className="gallary">
      <div className="photos">
        {
          loadedImages.map((file, index) => (
            index + 1 === loadedImages.length ?
            <div className="photo" key={index} style={{ backgroundImage: `url(${file.url})` }} alt={`File ${index}`} 
            ref={lastPhotoElementRef}
            ></div>
            : 
            <div className="photo" key={index} style={{ backgroundImage: `url(${file.url})` }} alt={`File ${index}`} ></div>
          ))
        }
      </div>
    </div>
  );
};

export default ShareGallery;
