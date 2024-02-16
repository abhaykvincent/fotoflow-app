import {Link} from 'react-router-dom';
import './ProjectCard.scss'

function ProjectCard({project, index}) {   
    //Project's selected photos count
    const getProjectSelectedPhotosCount = (project) => {
        return project.collections.flatMap(collection => collection.uploadedFiles)
            .filter(image => image?.status === 'selected')
            .length;
    }
  return (
    <Link className="project" to={`/project/${project.id}`} key={index}>
        <div className="cover-wrap">
            <div
                className="project-cover"
                style={{
                    backgroundImage: project.projectCover ? `url(${project.projectCover})` : '',
                    backgroundSize: project.projectCover ? 'cover' : '20%',
                }}
            />
        </div>
        <div className="project-details">
            <div className="details-top">
                <div className="left">
                    <h4 className="project-title">{project.name}</h4>
                    <p className="project-type">{project.type}</p>
                </div>
                <div className="right">
                    <div className="status-signal"></div>
                </div>
            </div>
            {
                project.collections.length === 0 ?
                    <div className="empty-message">
                        Upload your snaps
                    </div> :
                    <div className="project-summary">
                        <div className="summary-item collection-count">
                            <p>{project.collections.length}</p>
                            <div className="icon"></div>
                        </div>
                        <div className="summary-item photos-count">
                            <p>{project.uploadedFilesCount}</p>
                            <div className="icon"></div>
                        </div>
                        <div className="summary-item selected-count">
                            <p>{getProjectSelectedPhotosCount(project)}</p>
                            <div className="icon"></div>
                        </div>
                    </div>
            }
        </div>
        <div className="project-options">
            {
                // if pin available, show pin number  
                project.pin ?
                    <div className="pin">
                        <p className="pin-label">PIN</p>
                        <p className="pin-number">{project.pin}</p>
                    </div>
                    : ''
            }
        </div>
    </Link>
    );
}

    export default ProjectCard;
