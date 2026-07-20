import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BaseLayout } from './components/layout/BaseLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { ProtectedRoute, GuestOnlyRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Landing />} />

        {/* Only accessible when NOT logged in */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Only accessible when logged in as CANDIDATE */}
        <Route element={<ProtectedRoute role="CANDIDATE" />}>
          <Route path="candidate" element={<CandidateDashboard />} />
        </Route>

        {/* Only accessible when logged in as RECRUITER */}
        <Route element={<ProtectedRoute role="RECRUITER" />}>
          <Route path="recruiter" element={<RecruiterDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
