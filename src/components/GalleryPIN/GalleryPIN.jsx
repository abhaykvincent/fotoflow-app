import React, { useState, createRef, useEffect } from 'react';
import { MdLockOutline } from 'react-icons/md';
import './GalleryPIN.scss';

function GalleryPIN() {
    const [pin, setPin] = useState(['', '', '', '']);
    const pinInputs = pin.map(() => createRef());

    useEffect(() => {
        pinInputs[0].current.focus();
    }, []);

    const handlePinChange = (index, value) => {
        // Allow only numeric values
        const sanitizedValue = value.replace(/[^0-9]/g, '');
    
        const newPin = [...pin];
        newPin[index] = sanitizedValue.slice(0, 1); // Take only the first digit
        setPin(newPin);
    
        if (index < 3 && sanitizedValue !== '') {
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
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="1"
                        value={pin[index]}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        onFocus={() => inputRef.current.select()}
                        ref={inputRef}
                    />
                ))}
            </div>
            <button className='button primary' onClick={handlePinCheck}>Submit</button>
        </div>
    );
}

export default GalleryPIN;
