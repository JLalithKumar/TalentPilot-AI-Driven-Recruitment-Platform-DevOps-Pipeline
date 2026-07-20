import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { setCredentials } from '../../store/slices/authSlice';
import { BrainCircuit } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const getApiHost = () => typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const response = await fetch(`http://${getApiHost()}:8081/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch(setCredentials({ token: data.token, user: data }));
        navigate(data.role === 'RECRUITER' ? '/recruiter' : '/candidate');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-0"></div>
      
      <div className="glass-panel max-w-md w-full p-8 z-10 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        
        <div className="flex flex-col items-center mb-8">
          <BrainCircuit className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold text-center text-white">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to your TalentPilot account
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            type="email"
            label="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primaryHover transition-colors">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
