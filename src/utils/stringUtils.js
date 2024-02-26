// Function to generate a random string
export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
export function generateMemorablePIN(limit) {
  // Step 1: Generate two random digits
  const randomDigits = Array.from({ length: 2 }, () => Math.floor(Math.random() * 10));

  // Step 2: Memorable pattern
  const thirdDigit = randomDigits[Math.floor(Math.random() * randomDigits.length)] * 2;
  const fourthDigit = (thirdDigit + 1) % 10;

  // Step 3: Combine
  const pin = [...randomDigits, thirdDigit, fourthDigit];

  // Shuffle the PIN to add more randomness
  for (let i = pin.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pin[i], pin[j]] = [pin[j], pin[i]];
  }

  // Convert array to string
  let  pinStr = pin.join('');
  // Truncate the PIN if its length exceeds the limit
  if (limit && pinStr.length > limit) {
    pinStr = pinStr.slice(0, limit);
  }

  return pinStr
}

export function shortenFileName(fileName){
  return fileName?.length > 30
      ? `${fileName.substring(0, 10)}...${fileName.substring(fileName.length - 10)}`
      : fileName
}
export function convertMegabytes(megabytes, decimalPlaces = 0) {
  const sizes = ['MB', 'GB', 'TB'];

  let sizeIndex = 0;

  if (megabytes > 500 && sizes[sizeIndex] === 'MB') {
    megabytes /= 1000;
    sizeIndex++;
  }

  if (megabytes > 500 && sizes[sizeIndex] === 'GB') {
    megabytes /= 1000;
    sizeIndex++;
  }

  return `${megabytes.toFixed(decimalPlaces)} ${sizes[sizeIndex]}`;
}