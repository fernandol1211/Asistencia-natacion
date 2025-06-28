import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, LogIn, LogOut, Menu, X, Home, User, Phone } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { useNavigate, Link } from "react-router-dom";

interface HeaderProps {
  session: Session | null | undefined;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function Header({
  session,
  onLogout,
  onLoginClick,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Cerrar menú cuando cambia la sesión
  useEffect(() => {
    setIsMenuOpen(false);
  }, [session]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuAction = (action?: () => void) => {
    setIsMenuOpen(false);
    if (action) {
      setTimeout(action, 100);
    }
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-800 relative">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                  Control de Asistencias
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">
                  Sistema de gestión deportiva
                </p>
              </div>
            </Link>
          </div>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Inicio
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleNavigation("/about")}
            >
              <User className="mr-2 h-4 w-4" />
              Acerca de
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleNavigation("/contact")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Contacto
            </Button>
          </nav>

          {/* Botón hamburguesa */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            {/* Menú desplegable */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg ring-1 ring-black/5 py-2 z-50 transition-all animate-in slide-in-from-top-2">
                {/* Navegación móvil */}
                <button
                  type="button"
                  onClick={() => handleNavigation("/")}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                >
                  <Home className="h-4 w-4 text-blue-500" />
                  <span>Inicio</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigation("/about")}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                >
                  <User className="h-4 w-4 text-blue-500" />
                  <span>Acerca de</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigation("/contact")}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                >
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span>Contacto</span>
                </button>

                <div className="border-t my-2"></div>

                {session ? (
                  <>
                    {/* Información del usuario */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 font-medium">
                          Conectado
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {session.user.email}
                      </p>
                    </div>

                    {/* Botón cerrar sesión */}
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onLogout)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Estado desconectado */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-700 font-medium">
                          No conectado
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Inicia sesión para continuar
                      </p>
                    </div>

                    {/* Botón iniciar sesión */}
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onLoginClick)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <LogIn className="h-4 w-4 text-blue-500" />
                      <span>Iniciar sesión</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
