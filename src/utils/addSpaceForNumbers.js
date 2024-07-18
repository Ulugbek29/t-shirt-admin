export const addSpaceForNumbers = (number) => {
  if (isNaN(number)) {
    return "0";
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};