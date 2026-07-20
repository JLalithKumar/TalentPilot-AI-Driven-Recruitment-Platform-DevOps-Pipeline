import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { setCredentials } from '../../store/slices/authSlice';
import { BrainCircuit, Briefcase, Users } from 'lucide-react';
import classNames from 'classnames';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: (roleFromUrl === 'RECRUITER' || roleFromUrl === 'CANDIDATE') ? roleFromUrl : 'CANDIDATE',
    companyName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sync role if URL param changes after mount
  useEffect(() => {
    if (roleFromUrl === 'RECRUITER' || roleFromUrl === 'CANDIDATE') {
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }
  }, [roleFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(setCredentials({ token: data.token, user: data }));
        navigate(data.role === 'RECRUITER' ? '/recruiter' : '/candidate');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const isRecruiter = formData.role === 'RECRUITER';

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-background z-0">
        <div className={classNames(
          "absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 transition-all duration-700",
          isRecruiter ? "bg-primary/30" : "bg-accent/30"
        )}></div>
        <div className={classNames(
          "absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 transition-all duration-700",
          isRecruiter ? "bg-accent/20" : "bg-primary/20"
        )}></div>
      </div>
      
      <div className="glass-panel max-w-md w-full p-8 z-10 animate-fade-in relative overflow-hidden">
        {/* Top accent bar — color changes by role */}
        <div className={classNames(
          "absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500",
          isRecruiter ? "from-primary via-accent to-primary" : "from-accent via-indigo-400 to-accent"
        )}></div>
        
        <div className="flex flex-col items-center mb-8">
          <BrainCircuit className={classNames(
            "h-12 w-12 mb-4 transition-colors duration-300",
            isRecruiter ? "text-primary" : "text-accent"
          )} />
          <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {isRecruiter ? 'Start building your dream team' : 'Find your perfect next role'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Role Toggle */}
          <div className="flex gap-3 mb-6 p-1 bg-surfaceLight rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
              className={classNames(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                formData.role === 'CANDIDATE'
                  ? "bg-accent/20 border border-accent text-accent shadow-lg"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              )}
            >
              <Users className="h-4 w-4" />
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
              className={classNames(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                formData.role === 'RECRUITER'
                  ? "bg-primary/20 border border-primary text-primary shadow-lg"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              )}
            >
              <Briefcase className="h-4 w-4" />
              Recruiter
            </button>
          </div>

          <div className="flex gap-4">
            <Input id="firstName" type="text" label="First Name" required value={formData.firstName} onChange={handleChange} placeholder="John" />
            <Input id="lastName" type="text" label="Last Name" required value={formData.lastName} onChange={handleChange} placeholder="Doe" />
          </div>
          
          <Input id="email" type="email" label="Email address" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
          <Input id="password" type="password" label="Password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="••••••••" />
          
          {formData.role === 'RECRUITER' && (
            <Input id="companyName" type="text" label="Company Name" required value={formData.companyName} onChange={handleChange} placeholder="e.g. Acme Corp" />
          )}

          <Button
            type="submit"
            className={classNames("w-full mt-6 transition-all", isRecruiter ? "" : "bg-accent hover:bg-accent/90")}
            isLoading={isLoading}
          >
            {isRecruiter ? 'Create Recruiter Account' : 'Create Candidate Account'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent hover:text-accent/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
