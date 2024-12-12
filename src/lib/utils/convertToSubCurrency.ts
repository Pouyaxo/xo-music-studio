export default function convertToSubcurrency(amount: number): number {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount');
  }
  return Math.round(amount * 100);
}
