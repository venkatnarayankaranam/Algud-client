import React from 'react'
import { Link } from 'react-router-dom'

const SizeGuide = () => {
  return (
    <div className="container-max section-padding py-12">
      <h1 className="text-2xl font-serif font-bold mb-4">T-shirt Size Guide — India</h1>
      <p className="text-sm text-primary-900 mb-4">Use this guide to find the best fit. All measurements are chest width (body) taken flat.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-primary-200/30">
              <th className="py-3 text-primary-900 font-semibold">Size</th>
              <th className="py-3 text-primary-900 font-semibold">Chest (cm)</th>
              <th className="py-3 text-primary-900 font-semibold">Chest (in)</th>
              <th className="py-3 text-primary-900 font-semibold">Recommended Fit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-primary-50/5">
              <td className="py-3 text-primary-900">S</td>
              <td className="py-3 text-primary-900">91 - 96</td>
              <td className="py-3 text-primary-900">36 - 38</td>
              <td className="py-3 text-primary-900">Slim / Regular</td>
            </tr>
            <tr className="hover:bg-primary-50/5">
              <td className="py-3 text-primary-900">M</td>
              <td className="py-3 text-primary-900">97 - 102</td>
              <td className="py-3 text-primary-900">38 - 40</td>
              <td className="py-3 text-primary-900">Regular</td>
            </tr>
            <tr className="hover:bg-primary-50/5">
              <td className="py-3 text-primary-900">L</td>
              <td className="py-3 text-primary-900">103 - 108</td>
              <td className="py-3 text-primary-900">40 - 42</td>
              <td className="py-3 text-primary-900">Regular / Relaxed</td>
            </tr>
            <tr className="hover:bg-primary-50/5">
              <td className="py-3 text-primary-900">XL</td>
              <td className="py-3 text-primary-900">109 - 114</td>
              <td className="py-3 text-primary-900">42 - 45</td>
              <td className="py-3 text-primary-900">Relaxed</td>
            </tr>
            <tr className="hover:bg-primary-50/5">
              <td className="py-3 text-primary-900">XXL</td>
              <td className="py-3 text-primary-900">115 - 120</td>
              <td className="py-3 text-primary-900">45 - 47</td>
              <td className="py-3 text-primary-900">Relaxed / Oversize</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-primary-700 mt-4">Measurements are approximate — measure a favourite t-shirt flat and compare chest measurements for best fit.</p>

      <p className="mt-6 text-sm">Back to <Link to="/" className="text-gold-500">Home</Link></p>
    </div>
  )
}

export default SizeGuide
