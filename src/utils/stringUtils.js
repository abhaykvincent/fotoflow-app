// Function to generate a random string
export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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