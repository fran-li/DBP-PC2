import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ItemPage } from './pages/EnrollmentPage';
import { ItemDetailPage } from './pages/EnrollmentDetailPage';

function Protected({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <span className="font-bold text-teal-800">Campus · Cultura</span>
          <button type="button" className="button-secondary" onClick={() => { logout(); navigate('/login'); }}>
            Cerrar sesión
          </button>
        </div>
      </header>
      {children}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/locations" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/activities" element={<Protected><ActivitiesPage /></Protected>} />
     
      <Route path="/activities/:id/enrollments" element={<Protected><ActivitiesPage /></Protected>} />
      <Route path="/me/enrollments" element={<Protected><ActivitiesPage/></Protected>} />
       <Route path="/enrollments/:id/withdraw" element={<Protected><ActivitiesPage/></Protected>} />
      <Route path="*" element={<Navigate to="/activities" replace />} />
    </Routes>
  );
}
