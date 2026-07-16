import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { BrainCircuit, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-surface/80 border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <BrainCircuit className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
            <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-gray-200 transition-colors">
              TalentPilot
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'RECRUITER' ? '/recruiter' : '/candidate'} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <User className="h-4 w-4" />
                    <span>{user?.firstName}</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-1.5">
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
