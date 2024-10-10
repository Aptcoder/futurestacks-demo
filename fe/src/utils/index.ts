export const formatAmount = (amount: number) => {
  return (Math.round(amount * 100) / 10000).toFixed(2);
};
