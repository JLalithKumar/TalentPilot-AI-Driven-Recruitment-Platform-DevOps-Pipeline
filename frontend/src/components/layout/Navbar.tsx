import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { apiSlice } from '../../store/api/apiSlice';
import { BrainCircuit, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    navigate('/');
    setMenuOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '';

  const isRecruiter = user?.role === 'RECRUITER';
  const dashboardPath = isRecruiter ? '/recruiter' : '/candidate';
  const roleLabel = isRecruiter ? 'Recruiter' : 'Candidate';
  const roleColor = isRecruiter ? 'text-primary bg-primary/10 border-primary/30' : 'text-accent bg-accent/10 border-accent/30';

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-surface/80 border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BrainCircuit className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
            <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-gray-200 transition-colors">
              TalentPilot
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                {/* User pill button */}
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surfaceLight border border-white/5 hover:border-white/15 transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isRecruiter ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-accent/20 border-accent/40 text-accent'}`}>
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-white leading-tight">{user?.firstName} {user?.lastName}</div>
                    <div className={`text-xs font-medium px-1.5 py-0.5 rounded-full border inline-block mt-0.5 ${roleColor}`}>
                      {roleLabel}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-panel border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="text-xs text-gray-500 mb-1">Signed in as</div>
                      <div className="text-sm font-medium text-white truncate">{user?.email}</div>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to={dashboardPath}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5 py-2 rounded-lg font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
