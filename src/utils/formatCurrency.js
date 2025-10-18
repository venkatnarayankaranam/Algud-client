export function formatCurrency(val) {
  const num = Number(val || 0)
  // Format with two decimals and Indian rupee symbol
  return `₹${num.toFixed(2)}`
}

export default formatCurrency
