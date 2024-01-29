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