import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { setCredentials } from '../../store/slices/authSlice';
import { BrainCircuit } from 'lucide-react';
import classNames from 'classnames';

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CANDIDATE'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
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

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-0"></div>
      
      <div className="glass-panel max-w-md w-full p-8 z-10 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent"></div>
        
        <div className="flex flex-col items-center mb-8">
          <BrainCircuit className="h-12 w-12 text-accent mb-4" />
          <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join TalentPilot to power up your recruitment
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
              className={classNames("flex-1 py-2 text-sm font-medium rounded-lg border transition-all duration-200", 
                formData.role === 'CANDIDATE' ? "bg-primary/20 border-primary text-primary" : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500")}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
              className={classNames("flex-1 py-2 text-sm font-medium rounded-lg border transition-all duration-200", 
                formData.role === 'RECRUITER' ? "bg-accent/20 border-accent text-accent" : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500")}
            >
              Recruiter
            </button>
          </div>

          <div className="flex gap-4">
            <Input id="firstName" type="text" label="First Name" required value={formData.firstName} onChange={handleChange} placeholder="John" />
            <Input id="lastName" type="text" label="Last Name" required value={formData.lastName} onChange={handleChange} placeholder="Doe" />
          </div>
          
          <Input id="email" type="email" label="Email address" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
          <Input id="password" type="password" label="Password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="••••••••" />

          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Create Account
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
