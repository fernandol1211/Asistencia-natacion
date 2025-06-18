// src/components/Header.tsx
import { Button } from "@/components/ui/button";
import { Users, LogIn, LogOut } from "lucide-react";
import { type Session } from "@supabase/supabase-js";

interface HeaderProps {
  session: Session | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function Header({
  session,
  onLogout,
  onLoginClick,
}: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-xl font-bold">Control de Asistencias</h1>
        </div>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline">
              {session.user.email}
            </span>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-blue-700 flex items-center gap-2"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="text-white border-white hover:bg-blue-700 flex items-center gap-2"
            onClick={onLoginClick}
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Button>
        )}
      </div>
    </header>
  );
}
