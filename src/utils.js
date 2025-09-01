export const randomId = () => {
  const number = Math.random() * 100000;
  const [id] = number.toString().split(".");
  return id;
};
