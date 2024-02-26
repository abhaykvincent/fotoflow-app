import React, { useState, useRef } from 'react';
import { MdLockOutline } from 'react-icons/md'; // You can replace this with the actual icon library you are using

function GalleryPIN() {
  const [pin, setPin] = useState(['', '', '', '']);
  const pinInputs = Array.from({ length: 4 }, (_, index) => useRef(null));

  const handlePinChange = (index, value) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 3 && value !== '') {
      pinInputs[index + 1].current.focus();
    }
  };

  const handlePinCheck = () => {
    const enteredPin = pin.join('');
    // Add your logic to check the PIN
    console.log('Entered PIN:', enteredPin);
    // You can replace the above console.log with your actual authentication logic
  };

  return (
    <div className="gallery-pin-container">
      <MdLockOutline className="lock-icon" />
      <p>Enter your PIN</p>
      <div className="pin-inputs-container">
        {pinInputs.map((inputRef, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={pin[index]}
            onChange={(e) => handlePinChange(index, e.target.value)}
            onFocus={() => pinInputs[index].current.select()}
            ref={inputRef}
          />
        ))}
      </div>
      <button onClick={handlePinCheck}>Submit</button>
    </div>
  );
}

export default GalleryPIN;
