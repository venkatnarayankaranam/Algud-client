import React from 'react'
import { Link } from 'react-router-dom'

const Terms = () => {
  return (
    <div className="container-max section-padding py-12">
      <h1 className="text-2xl font-serif font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-primary-900 leading-relaxed">This is the Terms of Service for ALGUD. Replace with your legal terms and conditions governing use of the site.</p>
      <p className="mt-4 text-sm text-primary-700">Back to <Link to="/" className="text-gold-500">Home</Link></p>
    </div>
  )
}

export default Terms
