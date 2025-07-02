"use client";

import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AttendanceTracker from "./components/AttendanceTracker";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import Message from "./components/Message";
import DashboardPage from "./pages/Dashboard";
import AtletasPage from "./pages/Atletas";
import HorariosPage from "./pages/Horarios";

export default function AppContent() {
  const { showLogin, setShowLogin, isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Message message={null} />
      <Header />
      <LoginModal
        show={showLogin}
        onCancel={() => setShowLogin(false)}
        onLoginSuccess={() => {}}
        onRegisterSuccess={() => {}}
      />

      <main className="container mx-auto px-3 py-4 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <Routes>
          {/* Rutas para usuarios autenticados */}
          {session ? (
            <>
              <Route path="/" element={<DashboardPage />} />
              <Route
                path="/Asistencia-natacion"
                element={<AttendanceTracker />}
              />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/atletas" element={<AtletasPage />} />
              <Route path="/horarios" element={<HorariosPage />} />
              {/* Redirigir rutas no autorizadas al dashboard */}
              <Route path="*" element={<DashboardPage />} />
            </>
          ) : (
            <>
              {/* Rutas para usuarios no autenticados */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Redirigir cualquier otra ruta al home */}
              <Route path="*" element={<HomePage />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}
