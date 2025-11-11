// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react'

// const Footer = () => {
//   const [showSizeGuide, setShowSizeGuide] = useState(false)
//   return (
//   <footer className="bg-black text-white">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
//           {/* Brand */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black border border-white rounded-lg flex items-center justify-center">
//                 {/* Logo preload moved to index.html with correct path */}
//               <img 
//   src={Logo} 
//   alt="ALGUD Logo" 
//   className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
// />
// <span className="text-xl sm:text-2xl font-serif font-bold tracking-wide">
//   ALGUD
// </span>
//               </div>
//             </div>
//             <p className="text-primary-200 text-xs sm:text-sm leading-relaxed">
//               Discover luxury fashion that defines elegance and sophistication. 
//               ALGUD brings you the finest collection of premium clothing and accessories.
//             </p>
//             <div className="flex space-x-3 sm:space-x-4">
//               <a href="#" className="text-primary-200 hover:text-gold-500 transition-colors duration-200">
//                 <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
//               </a>
//               <a href="#" className="text-primary-200 hover:text-gold-500 transition-colors duration-200">
//                 <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
//               </a>
//               <a href="#" className="text-primary-200 hover:text-gold-500 transition-colors duration-200">
//                 <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="space-y-3 sm:space-y-4">
//             <h3 className="text-base sm:text-lg font-semibold">Quick Links</h3>
//             <ul className="space-y-1.5 sm:space-y-2">
//               <li>
//                 <Link to="/" className="text-gray-300 hover:text-gold-500 transition-colors text-xs sm:text-sm">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/products" className="text-primary-200 hover:text-gold-500 transition-colors duration-200 text-xs sm:text-sm">
//                   Shop All
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/products?category=Dresses" className="text-primary-200 hover:text-gold-500 transition-colors duration-200 text-xs sm:text-sm">
//                   Dresses
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/products?category=Accessories" className="text-primary-200 hover:text-gold-500 transition-colors duration-200 text-xs sm:text-sm">
//                   Accessories
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/products?category=Outerwear" className="text-gray-300 hover:text-gold-500 transition-colors text-xs sm:text-sm">
//                   Outerwear
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Customer Service */}
//           <div className="space-y-3 sm:space-y-4">
//             <h3 className="text-base sm:text-lg font-semibold">Customer Service</h3>
//             <ul className="space-y-1.5 sm:space-y-2">
//               <li>
//                 {/* Toggleable size guide for mobile; always visible on md+ */}
//                 <button
//                   onClick={() => setShowSizeGuide(!showSizeGuide)}
//                   className="text-primary-200 hover:text-gold-500 transition-colors duration-200 text-xs sm:text-sm flex items-center space-x-2"
//                 >
//                   <span>Size Guide</span>
//                   <span className="text-primary-400 text-[10px]">(Indian sizes)</span>
//                 </button>
//                 {/* Table shown on md+ or when toggled on mobile */}
//                 <div className={`${showSizeGuide ? 'block' : 'hidden'} md:block mt-3`}> 
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left text-xs sm:text-sm border-collapse">
//                       <thead>
//                         <tr>
//                           <th className="pb-2 text-primary-200 font-medium">Size</th>
//                           <th className="pb-2 text-primary-200 font-medium">Chest (cm)</th>
//                           <th className="pb-2 text-primary-200 font-medium">Chest (in)</th>
//                           <th className="pb-2 text-primary-200 font-medium">Recommended Fit</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td className="py-1 text-primary-200">S</td>
//                           <td className="py-1 text-primary-200">91 - 96</td>
//                           <td className="py-1 text-primary-200">36 - 38</td>
//                           <td className="py-1 text-primary-200">Slim / Regular</td>
//                         </tr>
//                         <tr>
//                           <td className="py-1 text-primary-200">M</td>
//                           <td className="py-1 text-primary-200">97 - 102</td>
//                           <td className="py-1 text-primary-200">38 - 40</td>
//                           <td className="py-1 text-primary-200">Regular</td>
//                         </tr>
//                         <tr>
//                           <td className="py-1 text-primary-200">L</td>
//                           <td className="py-1 text-primary-200">103 - 108</td>
//                           <td className="py-1 text-primary-200">40 - 42</td>
//                           <td className="py-1 text-primary-200">Regular / Relaxed</td>
//                         </tr>
//                         <tr>
//                           <td className="py-1 text-primary-200">XL</td>
//                           <td className="py-1 text-primary-200">109 - 114</td>
//                           <td className="py-1 text-primary-200">42 - 45</td>
//                           <td className="py-1 text-primary-200">Relaxed</td>
//                         </tr>
//                         <tr>
//                           <td className="py-1 text-primary-200">XXL</td>
//                           <td className="py-1 text-primary-200">115 - 120</td>
//                           <td className="py-1 text-primary-200">45 - 47</td>
//                           <td className="py-1 text-primary-200">Relaxed / Oversize</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                   <p className="text-primary-300 text-[11px] mt-2">Measurements are approximate — measure a favourite t-shirt flat and compare chest measurements for best fit.</p>
//                 </div>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-300 hover:text-gold-500 transition-colors text-xs sm:text-sm">
//                   Shipping Info
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-300 hover:text-gold-500 transition-colors text-xs sm:text-sm">
//                   Returns & Exchanges
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-300 hover:text-gold-500 transition-colors text-xs sm:text-sm">
//                   FAQ
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-300 hover:text-gold-500 transition-colors text-xs sm:text-sm">
//                   Contact Us
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-3 sm:space-y-4">
//             <h3 className="text-base sm:text-lg font-semibold">Contact Info</h3>
//             <div className="space-y-2 sm:space-y-3">
//               <div className="flex items-center space-x-2 sm:space-x-3">
//                 <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 flex-shrink-0" />
//                 <span className="text-primary-200 text-xs sm:text-sm">admin@algud.in</span>
//               </div>
//               <div className="flex items-center space-x-2 sm:space-x-3">
//                 <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 flex-shrink-0" />
//                 <span className="text-primary-200 text-xs sm:text-sm">+91 6302992183</span>
//               </div>
//               <div className="flex items-start space-x-2 sm:space-x-3">
//                 <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 mt-0.5 sm:mt-1 flex-shrink-0" />
//                 <span className="text-primary-200 text-xs sm:text-sm">
//                   Hyderabad<br />
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//           <div className="border-t border-primary-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
//           <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
//             <p className="text-primary-200 text-xs sm:text-sm">
//               © 2025 ALGUD. All rights reserved.
//             </p>
//             <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
//               <Link to="/privacy" className="text-primary-200 hover:text-gold-400 transition-colors duration-200 text-xs sm:text-sm">
//                 Privacy Policy
//               </Link>
//               <Link to="/terms" className="text-primary-200 hover:text-gold-400 transition-colors duration-200 text-xs sm:text-sm">
//                 Terms of Service
//               </Link>
//               <Link to="/cookies" className="text-primary-200 hover:text-gold-400 transition-colors duration-200 text-xs sm:text-sm">
//                 Cookie Policy
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import Logo from '../assets/logo.png' // ✅ your logo file path

const Footer = () => {
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={Logo} 
                alt="ALGUD Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-serif font-bold tracking-wide">ALGUD</span>
            </div>

            <p className="text-primary-200 text-xs sm:text-sm leading-relaxed">
              Discover luxury fashion that defines elegance and sophistication.
              ALGUD brings you the finest collection of premium clothing and accessories.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="text-primary-200 hover:text-gold-500 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-200 hover:text-gold-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-200 hover:text-gold-500 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gold-500 text-sm">Home</Link></li>
              <li><Link to="/products" className="hover:text-gold-500 text-sm">Shop All</Link></li>
              <li><Link to="/products?category=Dresses" className="hover:text-gold-500 text-sm">Dresses</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-gold-500 text-sm">Accessories</Link></li>
              <li><Link to="/products?category=Outerwear" className="hover:text-gold-500 text-sm">Outerwear</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="hover:text-gold-500 flex items-center space-x-2"
                >
                  <span>Size Guide</span>
                  <small className="text-primary-400">(Indian sizes)</small>
                </button>

                <div className={`${showSizeGuide ? 'block' : 'hidden'} md:block mt-3`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr>
                          <th className="pb-2 text-primary-200 font-medium">Size</th>
                          <th className="pb-2 text-primary-200 font-medium">Chest (cm)</th>
                          <th className="pb-2 text-primary-200 font-medium">Chest (in)</th>
                          <th className="pb-2 text-primary-200 font-medium">Recommended Fit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>S</td><td>91 - 96</td><td>36 - 38</td><td>Slim / Regular</td></tr>
                        <tr><td>M</td><td>97 - 102</td><td>38 - 40</td><td>Regular</td></tr>
                        <tr><td>L</td><td>103 - 108</td><td>40 - 42</td><td>Regular / Relaxed</td></tr>
                        <tr><td>XL</td><td>109 - 114</td><td>42 - 45</td><td>Relaxed</td></tr>
                        <tr><td>XXL</td><td>115 - 120</td><td>45 - 47</td><td>Relaxed / Oversize</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>

              <li><a href="#" className="hover:text-gold-500">Shipping Info</a></li>
              <li><a href="#" className="hover:text-gold-500">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-gold-500">FAQ</a></li>
              <li><a href="#" className="hover:text-gold-500">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="text-gold-500" size={18} />
                <span>admin@algud.in</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gold-500" size={18} />
                <span>+91 6302992183</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-gold-500" size={18} />
                <span>Hyderabad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 mt-8 pt-6 text-center sm:flex sm:justify-between sm:items-center">
          <p className="text-sm text-primary-200">© 2025 ALGUD. All rights reserved.</p>
          <div className="flex space-x-6 text-sm mt-3 sm:mt-0">
            <Link to="/privacy" className="hover:text-gold-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-400">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-gold-400">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
