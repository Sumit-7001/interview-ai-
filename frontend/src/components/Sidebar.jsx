import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Settings, 
  LogOut, 
  Video, 
  Play,
  BookOpen,
  ChevronRight
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
    { name: 'Question Bank', path: '/question-bank', icon: BookOpen },
    { name: 'Start Interview', path: '/interview/new', icon: Play },
    { name: 'Resume Management', path: '/resume', icon: FileText },
    { name: 'Interview History', path: '/history', icon: History },
  ];

  return (
    <aside className="w-64 bg-midnight text-gray-400 h-screen sticky top-0 shrink-0 flex flex-col border-r border-midnight-border z-30 overflow-y-auto self-start">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-midnight-border/60">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-white">
          <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center shadow-sm">
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
                  ? 'bg-primary text-white shadow-glow font-semibold' 
                  : 'hover:bg-midnight-light hover:text-white'
              }`
            }
          >
            <link.icon size={18} />
            <span className="flex-1">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Block */}
      <div className="p-4 border-t border-midnight-border/60 flex flex-col gap-2.5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-midnight-light/60 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm">
            {user?.first_name?.[0]?.toUpperCase() || 'M'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-white truncate">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Moumi Dey'}
            </span>
            <span className="text-xs text-gray-400 truncate">
              {user?.email || 'moumidey2908@gmail.com'}
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors shrink-0" />
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-2 py-2 text-sm font-medium rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} className="text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
