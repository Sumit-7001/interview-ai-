import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Video, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    // If not on landing page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/' + sectionId);
    } else {
      const el = document.querySelector(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-7xl z-50 transition-all duration-300">
      <div className="glass-card py-3 px-6 md:px-8 flex items-center justify-between shadow-premium border border-white/40">
        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg md:text-xl tracking-tight text-midnight">
          <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
            <Video size={18} className="animate-pulse" />
          </div>
          <span>Interview<span className="text-primary">AI</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          <button onClick={() => handleNavClick('#features')} className="hover:text-primary transition-colors">Features</button>
          <button onClick={() => handleNavClick('#how-it-works')} className="hover:text-primary transition-colors">How It Works</button>
          <button onClick={() => handleNavClick('#pricing')} className="hover:text-primary transition-colors">Pricing</button>
          <button onClick={() => handleNavClick('#faq')} className="hover:text-primary transition-colors">FAQ</button>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-midnight hover:text-primary transition-colors flex items-center gap-1.5">
                <User size={16} />
                <span>Dashboard</span>
              </Link>
              <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
              <Link to="/dashboard" className="btn-primary py-2 text-sm">
                <span>Practice Room</span>
                <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-midnight hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary py-2 text-sm">
                <span>Get Started</span>
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-midnight hover:text-primary focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-2 w-full glass-card p-5 border border-white/40 shadow-premium flex flex-col gap-4 animate-fadeIn">
          <button onClick={() => handleNavClick('#features')} className="text-left py-2 font-medium hover:text-primary">Features</button>
          <button onClick={() => handleNavClick('#how-it-works')} className="text-left py-2 font-medium hover:text-primary">How It Works</button>
          <button onClick={() => handleNavClick('#pricing')} className="text-left py-2 font-medium hover:text-primary">Pricing</button>
          <button onClick={() => handleNavClick('#faq')} className="text-left py-2 font-medium hover:text-primary">FAQ</button>
          <hr className="border-gray-200" />
          {user ? (
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-2 text-midnight font-medium flex items-center gap-2">
                <User size={16} /> Dashboard
              </Link>
              <button onClick={() => { setIsOpen(false); logout(); }} className="text-left py-2 text-red-500 font-medium flex items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="btn-primary w-full py-2.5">
                Practice Room
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2.5 font-medium hover:text-primary">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full py-2.5 text-center">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
