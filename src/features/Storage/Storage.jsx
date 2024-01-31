import React from 'react'
import './Storage.scss'
import StoragePie from '../../components/StoragePie/StoragePie';

function Storage() {
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
            <StoragePie totalSpace={1024} usedSpace={650} />
        </div>
        {/* <p className="storage-insight">Storing 24034 photos in 17 collections</p> */}
        <div className="storage-subscription">
            <div className="subscription-info">
                <div className="subscription-group">
                    <div className="box-content">
                        <h2>Free Storage</h2>
                        <p>FotoFlow Free Trial Includes: 5GB</p>
                    </div>
                    <div className="action">
                        <div className="button primary large">Upgrade</div>
                    </div>
                </div>
                <div className="subscription-group">
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
    </main>
  )
}

export default Storage