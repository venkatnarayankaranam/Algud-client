import React from 'react'
import { Link } from 'react-router-dom'

const Cookies = () => {
  return (
    <div className="container-max section-padding py-12">
      <h1 className="text-2xl font-serif font-bold mb-4">Cookie Policy</h1>
      <p className="text-sm text-primary-900 leading-relaxed">This Cookie Policy explains how ALGUD uses cookies and similar technologies. Replace this placeholder text with your policy.</p>
      <p className="mt-4 text-sm text-primary-700">Back to <Link to="/" className="text-gold-500">Home</Link></p>
    </div>
  )
}

export default Cookies
