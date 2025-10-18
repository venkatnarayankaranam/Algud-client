import { useEffect, useState } from 'react'

const Loader = ({ onLoaded }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Ensure the loader shows for at least MIN_SHOW milliseconds so the brand animation is visible.
    const MIN_SHOW = 3000 // 3 seconds
    const mountedAt = Date.now()

    // Listen for the custom event 'app:ready' dispatched from main.jsx when the app finishes mounting
    const handler = () => {
      // ensure a minimum display duration
      const elapsed = Date.now() - mountedAt
      const remaining = Math.max(0, MIN_SHOW - elapsed)

      setTimeout(() => {
        // fade out, then call onLoaded
        setVisible(false)
        setTimeout(() => onLoaded && onLoaded(), 300)
      }, remaining)
    }

    window.addEventListener('app:ready', handler)
    return () => window.removeEventListener('app:ready', handler)
  }, [onLoaded])

  return (
    <div className={`algud-loader ${visible ? 'algud-loader--visible' : 'algud-loader--hidden'}`}>
      <div className="algud-loader__inner" aria-hidden={!visible}>
        {['A','L','G','U','D'].map((char, idx) => (
          <span
            key={char}
            className="algud-loader__char"
            style={{ animationDelay: `${idx * 120}ms, ${idx * 120}ms` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Loader
