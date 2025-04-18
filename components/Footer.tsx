// --- FILE: components/Footer.tsx ---

import Link from 'next/link';

const Footer = () => {
  // Getting the current year dynamically is better done client-side or passed as prop if needed server-side
  // For simplicity here, we'll just use a placeholder or keep it as is if client component
  // const currentYear = new Date().getFullYear(); // This would work fine in a client component

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10"> {/* Adjusted grid for better responsiveness */}
          {/* Col 1: Logo y Social */}
          <div>
            <Link href="/" className="text-2xl font-pacifico text-white mb-4 inline-block">
               BizPlan
            </Link>
            <p className="text-gray-400 mb-4 text-sm">The marketplace for business templates.</p>
            <div className="flex space-x-3">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <i className="ri-twitter-x-line"></i>
               </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <i className="ri-instagram-line"></i>
              </a>
              {/* Añade más redes si es necesario */}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition">Browse Categories</Link></li>
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition">How It Works</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition">Help Center</Link></li>
               <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          {/* Using a fixed year for now, or make Footer a client component to use new Date() */}
          <p>&copy; {new Date().getFullYear()} BizPlan. All rights reserved.</p> {/* Updated to use dynamic year */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;