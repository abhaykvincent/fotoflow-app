import React, { useState, createRef, useEffect } from 'react';
import { MdLockOutline } from 'react-icons/md';
import './GalleryPIN.scss';

function GalleryPIN({setAuthenticated,projectPin}) {
    const [pin, setPin] = useState(['', '', '', '']);
    const [pinError, setPinError] = useState(false);
    const pinInputs = pin.map(() => createRef());

    useEffect(() => {
        pinInputs[0].current.focus();
    }, []);

    const handlePinCheck = (enteredPin) => {
        if(enteredPin === projectPin){
            setAuthenticated(true);
        }
        else{
            setPinError(true);
            setTimeout(() => {
                setPinError(false);
                setPin(['', '', '', '']);
                if (pinInputs[0] && pinInputs[0].current) {
                    pinInputs[0].current.focus();
                } else {
                    console.log(pinInputs[0])
                    console.error('pinInputs[0] or pinInputs[0].current is null or undefined');
                }
            }, 500);
        }
        // You can replace the above console.log with your actual authentication logic
    };
    const handlePinChange = (index, value) => {
        // Allow only numeric values
        const sanitizedValue = value.replace(/[^0-9]/g, '');
    
        const newPin = [...pin];
        newPin[index] = sanitizedValue.slice(0, 1); // Take only the first digit
        setPin(newPin);
        console.log(newPin)
        if (index < 3 && sanitizedValue !== '') {
          pinInputs[index + 1].current.focus();
        }
        else{
            pinInputs[0].current.focus();
            const enteredPin = newPin.join('');
            enteredPin.length === 4 && handlePinCheck(enteredPin);
        }
        // if backspace or delete is pressed, focus the previous input
        if (sanitizedValue === '' && index > 0) {
          pinInputs[index - 1].current.focus();
        }
      };


    return (
        <div className="gallery-pin-container">
            <MdLockOutline className="lock-icon" />
            <p>Enter your PIN</p>
            <div className="pin-inputs-container">
                {pinInputs.map((inputRef, index) => (
                    <input
                    className={`pin-input ${pinError ? 'error' : ''}`}
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
