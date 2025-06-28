import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AttendanceTracker from "./components/AttendanceTracker";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import Message from "./components/Message";

export default function AppContent() {
  const { showLogin, setShowLogin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
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
          <Route path="/" element={<HomePage />} />
          <Route path="/asistencias" element={<AttendanceTracker />} />
          <Route path="/Asistencia-natacion" element={<AttendanceTracker />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  );
}
