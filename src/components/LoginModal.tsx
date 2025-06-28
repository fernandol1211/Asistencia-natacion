"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";

interface LoginModalProps {
  show: boolean;
  onCancel: () => void;
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
}

export default function LoginModal({
  show,
  onCancel,
  onLoginSuccess,
  onRegisterSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Eliminamos setSession ya que no es necesario

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Registro
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (onRegisterSuccess) onRegisterSuccess();
        setError(
          "¡Registro exitoso! Por favor verifica tu email antes de iniciar sesión"
        );
      } else {
        // Inicio de sesión
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Eliminamos setSession porque el contexto ya maneja esto automáticamente
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      console.error("Error de autenticación:", err);
      setError(
        isSignUp
          ? "Error al registrarse. Por favor, inténtelo de nuevo."
          : "Credenciales incorrectas. Por favor, inténtelo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </h2>

          {error && (
            <div
              className={`mb-4 p-3 rounded-md text-center ${
                error.includes("éxito")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Cargando..."
                  : isSignUp
                  ? "Registrarse"
                  : "Iniciar sesión"}
              </Button>

              <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:underline"
            >
              {isSignUp
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
