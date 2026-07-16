import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface/50 border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 opacity-50">
          <BrainCircuit className="h-5 w-5" />
          <span className="font-heading font-semibold tracking-tight">TalentPilot © {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
