import React from 'react'

const WatermarkBackground = ({ theme = 'default' }) => {
  // theme can be used to vary watermark opacity/color per festival
  const styles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: theme === 'diwali' ? 0.06 : 0.04
  }

  return (
    <div style={styles} className="watermark-bg">
      <svg width="800" height="800" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-15deg)', opacity: 0.12 }}>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#C7A45A" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#F9F3E7" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" rx="40" fill="url(#g1)" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="48" fill="#000" fillOpacity="0.06">ALGUD</text>
      </svg>
    </div>
  )
}

export default WatermarkBackground
