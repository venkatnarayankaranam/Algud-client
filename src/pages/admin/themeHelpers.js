// Shared helpers for admin badge colors and pill styles
export const pillClass = (extra = '') => `inline-block px-3 py-1.5 text-xs font-semibold rounded-full border ${extra} uppercase tracking-wider`

export const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-200'
  const s = String(status).toLowerCase()
  if (s === 'delivered') return 'bg-green-100 text-green-800 border-green-200'
  if (s === 'pending' || s === 'processing' || s === 'shipped') return 'bg-amber-100 text-amber-800 border-amber-200'
  if (s === 'cancelled' || s === 'canceled') return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getPaymentColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-200'
  const s = String(status).toLowerCase()
  if (s === 'paid') return 'bg-green-100 text-green-800 border-green-200'
  if (s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200'
  if (s === 'failed') return 'bg-red-100 text-red-800 border-red-200'
  if (s === 'refunded') return 'bg-blue-100 text-blue-800 border-blue-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getRoleColor = (role) => {
  if (!role) return 'bg-gray-100 text-gray-800 border-gray-200'
  const r = String(role).toLowerCase()
  if (r === 'admin') return 'bg-indigo-100 text-indigo-800 border-indigo-200'
  if (r === 'user') return 'bg-gray-100 text-gray-800 border-gray-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}
