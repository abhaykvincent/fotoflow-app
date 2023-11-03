import React, { useState, useEffect } from 'react';
import './Alert.scss';

const Alert = ({ type, message, show, setAlert }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setAlert( '', '', false);
      }, 1000); // Hide after 1 second
    }
  }, [show]);

  const alertClass = `alert ${type} ${visible ? 'show' : ''}`;

  return (
    <div className={alertClass}>
      {message}
    </div>
  );
};

export default Alert;
