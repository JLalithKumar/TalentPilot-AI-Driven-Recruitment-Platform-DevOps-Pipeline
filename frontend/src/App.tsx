import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BaseLayout } from './components/layout/BaseLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Landing />} />
        
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route path="candidate" element={<CandidateDashboard />} />
        <Route path="recruiter" element={<RecruiterDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
