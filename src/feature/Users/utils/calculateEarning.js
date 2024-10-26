export const calculateEarning = (balance, total_amount_withdrawn, total_amount_recharged) => {
  const earning = Number(balance) + Number(total_amount_withdrawn) - Number(total_amount_recharged);
  // Ensure result is not negative
  const finalEarning = Math.max(earning, 0);
  return finalEarning.toFixed(2);
};
