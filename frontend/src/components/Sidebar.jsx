import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Settings, 
  LogOut, 
  Video, 
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { confirm, toast } = useAlert();

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Sign Out?',
      message: 'Are you sure you want to log out of your session?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning'
    });
    if (!ok) return;
    logout();
    toast.info('You have signed out successfully.', 'Session Closed');
  };

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Start Interview', path: '/interview/new', icon: Play },
    { name: 'Resume Management', path: '/resume', icon: FileText },
    { name: 'Interview History', path: '/history', icon: History },
  ];

  return (
    <aside className="w-64 bg-midnight text-gray-400 h-screen sticky top-0 shrink-0 flex flex-col border-r border-midnight-border z-30 overflow-y-auto self-start">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-midnight-border/60">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-white">
          <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
            <Video size={18} />
          </div>
          <span>Interview<span className="text-primary">AI</span></span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5 text-sm font-medium">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-glow' 
                  : 'hover:bg-midnight-light hover:text-white'
              }`
            }
          >
            <link.icon size={18} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Block */}
      <div className="p-4 border-t border-midnight-border/60 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-display font-bold">
            {user?.first_name?.[0].toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-gray-500 truncate">{user?.email}</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
