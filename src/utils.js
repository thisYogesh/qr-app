export const randomId = () => {
  const number = Math.random() * 100000;
  const [id] = number.toString().split(".");
  return id;
};

export const getDataUrl = file => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    try {
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    } catch {
      reject("FAILED_TO_CONVERT_DATA_URL");
    }
  });
};
