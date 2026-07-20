import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Briefcase, Users, Zap, ArrowRight, Shield } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center py-20 px-4 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl opacity-30 animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surfaceLight border border-white/10 mb-8 shadow-lg">
            <BrainCircuit className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-gray-300">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 leading-tight">
            The Future of <br className="hidden md:block"/> Recruitment is Here
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            TalentPilot matches top candidates with perfect roles using intelligent AI resume parsing, automated scoring, and predictive hiring algorithms.
          </p>
          
          {/* Two distinct CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            {/* Recruiter CTA */}
            <Link to="/register?role=RECRUITER" className="group relative w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-surface rounded-xl border border-primary/30 group-hover:border-primary/60 transition-all duration-300">
                <Briefcase className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-0.5">For Recruiters</div>
                  <div className="text-white font-bold text-lg leading-tight">Start Hiring Now</div>
                </div>
                <ArrowRight className="h-5 w-5 text-primary ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Candidate CTA */}
            <Link to="/register?role=CANDIDATE" className="group relative w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-indigo-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-surface rounded-xl border border-accent/30 group-hover:border-accent/60 transition-all duration-300">
                <Users className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-0.5">For Candidates</div>
                  <div className="text-white font-bold text-lg leading-tight">Find Your Next Job</div>
                </div>
                <ArrowRight className="h-5 w-5 text-accent ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Social proof / trust bar */}
          <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-green-500" />
              <span>JWT Secured</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BrainCircuit className="h-4 w-4 text-primary" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Real-time Scoring</span>
            </div>
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
              accent="primary"
            />
            <FeatureCard 
              icon={<Briefcase className="h-8 w-8 text-accent" />}
              title="Smart Job Parsing"
              description="Our NLP models extract key requirements from job descriptions automatically."
              accent="accent"
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-indigo-400" />}
              title="Seamless Workflows"
              description="Kanban-style applicant tracking makes managing the hiring pipeline effortless."
              accent="indigo"
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-surface to-accent/10 border-t border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to transform your hiring?</h3>
          <p className="text-gray-400 mb-8">Join TalentPilot today. It's free to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=RECRUITER" className="btn-primary px-8 py-3 text-base font-semibold inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Post a Job
            </Link>
            <Link to="/login" className="px-8 py-3 text-base font-semibold text-gray-300 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-all inline-flex items-center gap-2">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, accent }: { icon: React.ReactNode, title: string, description: string, accent: string }) => {
  const borderHover = accent === 'primary' ? 'group-hover:border-primary/30' : accent === 'accent' ? 'group-hover:border-accent/30' : 'group-hover:border-indigo-400/30';
  return (
    <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300">
      <div className={`bg-surfaceLight w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5 ${borderHover} transition-colors`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};
