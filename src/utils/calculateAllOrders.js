export const calculateTotalPrice = (allOrders) => {
  // Check if allOrders is empty or undefined
  if (!Array.isArray(allOrders) || allOrders.length === 0) {
    return 0;
  }

  // Calculate total price if allOrders is populated
  const totalPrice = allOrders.reduce((acc, cur) => acc + cur.total_price, 0);
  return isNaN(totalPrice) ? 0 : totalPrice; // Ensure totalPrice is a valid number
};