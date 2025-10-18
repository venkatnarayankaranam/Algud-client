import React from 'react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  return (
    <div className="container-max section-padding py-12">
      <h1 className="text-2xl font-serif font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-primary-900 leading-relaxed">This is the privacy policy for ALGUD. Replace this placeholder with your legal text describing how user data is collected, processed, and stored.</p>
      <p className="mt-4 text-sm text-primary-700">Back to <Link to="/" className="text-gold-500">Home</Link></p>
    </div>
  )
}

export default Privacy
