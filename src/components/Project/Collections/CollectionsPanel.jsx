import { Link } from 'react-router-dom';
export default function CollectionsPanel({ project, collectionId, deleteCollection, openModal }) {
    const handleDeleteCollection = (projectId, collectionId) => {
      if (window.confirm('Are you sure you want to delete this collection?')) {
        deleteCollection(projectId, collectionId);
      }
    };
  
    return (
      <div className="collections-panel">
        <div className="collections-list">
        {
          project.collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`collection-tab ${collection.id === collectionId || (!collectionId && index === 0) ? 'active' : ''}`}
            >
              <Link to={`/project/${project.id}/${collection.id}`}>{collection.name}</Link>
              <div className="delete-collection"
                onClick={() => handleDeleteCollection(project.id, collection.id)}
              >X</div>
            </div>
          ))
        }
        </div>
        
  
        <div className="button secondary add-collection"
          onClick={openModal}
        >Add Collection</div>
      </div>
    );
  }