export const generatePaystackReference = (): string => {
  // Create a random reference string using current time and random number
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 12)}`.toUpperCase();
};

export const getPaymentParts = (amount: number) => {
  return {
    system: 0.1 * amount,
    rider: amount - 0.1 * amount,
  };
};
