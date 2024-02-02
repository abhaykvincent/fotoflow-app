import React, { useEffect } from 'react';
import { convertMegabytes } from '../../utils/stringUtils';

const StoragePie = ({ totalSpace, usedSpace }) => {
  const [currentUsedSpace , setCurrentUsedSpace] = React.useState(0);
  useEffect(() => {
    setTimeout(() => {
      setCurrentUsedSpace(usedSpace)
    }, 200);
  }, []);
  // Calculate the percentage of used space
  const usedPercentage = (currentUsedSpace / totalSpace) * 100;

  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * 40; // Assuming a radius of 50

  // Calculate the stroke dasharray and stroke dashoffset
  const dasharray = `${circumference} ${circumference}`;
  const dashoffset = circumference - (usedPercentage / 100) * circumference;

  return (
    <svg width="200" height="200" viewBox="0 0 100 100">
      <circle
        className='available-storage'
        cx="50"
        cy="50"
        r="40"
        fill="none"
        strokeWidth="6" // Set the border width
      />
      <circle
        className='used-storage'
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#3498db" // Set the used space color
        strokeWidth="5"
        strokeDasharray={dasharray}
        strokeDashoffset={dashoffset}
        //round
        strokeLinecap='round'
        transform="rotate(-90 50 50)"
      />
            <text className='used-storage-text' x="50" y="47" textAnchor="middle" dy="0.3em" fill="white" style={{ maxWidth: '50px' }}>
                {convertMegabytes(currentUsedSpace,1)}
            </text>
            <text className='available-storage-text' x="50" y="58" textAnchor="middle" dy="0.3em" fill="white" style={{ maxWidth: '50px' }}>
                {`of ${convertMegabytes(totalSpace)} (${usedPercentage.toFixed(1)}%)`}
            </text>

    </svg>
  );
};

export default StoragePie;
