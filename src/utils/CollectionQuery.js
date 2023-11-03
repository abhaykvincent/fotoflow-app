export const findCollectionById = (project,collectionId) => {
    const collection = project.collections.find((col) => col.id === collectionId);
    return collection ? collection : 'Collection not found';
  };