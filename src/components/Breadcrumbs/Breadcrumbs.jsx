import React from 'react';

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className="breadcrumbs">
      {breadcrumbs.map((crumb, index) => (
        <div className="crumb" key={index}>
          <div className="back-button"></div>
          {crumb}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
