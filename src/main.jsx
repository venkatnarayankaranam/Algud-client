import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { useState, useEffect } from 'react'
import Loader from './components/Loader'

function Root() {
  const [loaderVisible, setLoaderVisible] = useState(true)

  useEffect(() => {
    // Ensure loader shows for at least 3 seconds on initial load
    const minDelay = 3000
    const t = setTimeout(() => {
      // notify loader to hide via the existing event handler
      window.dispatchEvent(new Event('app:ready'))
    }, minDelay)

    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {loaderVisible && <Loader onLoaded={() => setLoaderVisible(false)} />}
      <App />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
