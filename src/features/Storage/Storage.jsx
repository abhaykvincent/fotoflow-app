import React from 'react'
import './Storage.scss'
import StoragePie from '../../components/StoragePie/StoragePie';
import { convertMegabytes } from '../../utils/stringUtils';

function Storage({projects}) {
    // Calculate the storage used from projects importFileSize
    const usedSpace = projects.reduce((acc,project) => {
        return acc + project.totalFileSize
    },0)
    console.log(usedSpace)

    const progressPercentage = 25; // Set the desired progress percentage

  // Calculate the stroke-dashoffset based on the percentage
  const dashOffset = ((100 - progressPercentage) / 100) * (Math.PI * 2 * 70);

  return (
    <main className='storage-page'>
        <div className="page-header">
            <h1>Storage</h1>
        </div>
      <div className="storage-info">
        <div className="storage-pie-wrap">
            <StoragePie totalSpace={1024} usedSpace={usedSpace} />
        </div>
        {/* <p className="storage-insight">Storing 24034 photos in 17 collections</p> */}
        <div className="storage-subscription">
            <div className="subscription-info row-group">
                <div className="row subscription-group">
                    <div className="box-content">
                        <h2>Free Storage</h2>
                        <p>FotoFlow Free Trial Includes: 5GB</p>
                    </div>
                    <div className="action">
                        <div className="button primary large">Upgrade</div>
                    </div>
                </div>
                <div className="row subscription-group">
                    <div className="box-content">
                        <h2>Add-on Storage</h2>
                        <p>Get more storage</p>
                    </div>
                    <div className="action">
                        <div className="button secondary large">Manage</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <section className="breakdown">
        <h2>Breakdown</h2>
        <div className="bar">
            <div className="used"></div>
            <div className="videos"></div>
            <div className="duplicates"></div>
        </div>
        <div className="breakdown-info">

        </div>
      </section>
      <section className="breakdown projects">
        <h2>Projects</h2>
        <div className="row-group">
            {
                projects.map((project)=>{
                    console.log(project)
                    return (
                        <div className="row">
                            <div className="box-content">
                                <h3>{project.name}</h3>
                                <div className="project-info">
                                    <p>{convertMegabytes(project.totalFileSize,2)} </p>
                                </div>
                            </div>
                            <div className="action">
                                <div className="button primary">Manage</div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
      </section>
    </main>
  )
}

export default Storage