const checkImageValidity = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      return resolve(url);
    };
    img.onerror = () => {
      return reject(new Error(`Failed to load image at: ${url}`));
    };
    img.src = url;
  });
};

export default checkImageValidity;
