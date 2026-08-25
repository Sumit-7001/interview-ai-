import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-midnight text-gray-400 py-16 border-t border-midnight-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        
        {/* Brand details */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-white">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <Video size={18} />
            </div>
            <span>Interview<span className="text-primary">AI</span></span>
          </Link>
          <p className="text-sm text-gray-500 max-w-xs">
            Practice smarter. Speak confidently. Ace your next interview with real-time feedback powered by computer vision and AI.
          </p>
        </div>

        {/* Column 1 - Product */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Practice Room</Link></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Analytics Reports</Link></li>
          </ul>
        </div>

        {/* Column 2 - Resources */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
          </ul>
        </div>

        {/* Column 3 - Company */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      {/* Under line block */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-midnight-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} InterviewAI. All rights reserved.</span>
        <span>Made with ❤️ for modern professionals.</span>
      </div>
    </footer>
  );
};

export default Footer;
