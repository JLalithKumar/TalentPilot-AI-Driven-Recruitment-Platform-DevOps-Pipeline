import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Briefcase, Users, Zap } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Landing = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surfaceLight border border-white/10 mb-8 shadow-lg">
            <BrainCircuit className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-gray-300">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6">
            The Future of <br className="hidden md:block"/> Recruitment is Here
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            TalentPilot matches top candidates with perfect roles using intelligent AI resume parsing, automated scoring, and predictive hiring algorithms.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button className="px-8 py-4 text-lg font-semibold">
                Start Hiring Now
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="px-8 py-4 text-lg font-semibold">
                Find Your Next Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface/50 py-24 px-4 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why TalentPilot?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Our platform eliminates the noise, surfacing the best matches in seconds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Instant AI Matching"
              description="Upload a resume and instantly see a compatibility score against all open roles."
            />
            <FeatureCard 
              icon={<Briefcase className="h-8 w-8 text-accent" />}
              title="Smart Job Parsing"
              description="Our NLP models extract key requirements from job descriptions automatically."
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-indigo-400" />}
              title="Seamless Workflows"
              description="Kanban-style applicant tracking makes managing the hiring pipeline effortless."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300">
    <div className="bg-surfaceLight w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:border-primary/30 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);
