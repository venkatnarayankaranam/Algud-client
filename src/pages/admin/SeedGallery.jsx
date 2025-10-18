import { useEffect, useState } from 'react'

const SeedGallery = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetch('/seedImages.json')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error('Failed to load seed images', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Seed Images</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map(img => (
          <div key={img.public_id} className="bg-white p-4 rounded shadow">
            <img src={img.secure_url} alt={img.file} className="w-full h-48 object-contain" />
            <div className="mt-2 text-sm text-gray-600">{img.file}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SeedGallery
