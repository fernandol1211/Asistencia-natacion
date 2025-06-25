"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LogIn,
  Info,
  Users,
  UserPlus,
  Lock,
  Mail,
  Key,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginFormProps {
  onCancel: () => void;
  onLoginSuccess: () => void;
  onRegisterSuccess: () => void;
}

export default function LoginForm({
  onCancel,
  onLoginSuccess,
  onRegisterSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error("Por favor completa ambos campos");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (
          signInError.status === 400 &&
          signInError.message.includes("Invalid login credentials")
        ) {
          throw new Error(
            "Credenciales inválidas. Verifica tu email y contraseña."
          );
        }
        throw new Error(signInError.message || "Error al iniciar sesión");
      }

      onLoginSuccess();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Error desconocido al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Por favor completa todos los campos");
      }

      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      // Registrar usuario
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Si el registro es exitoso, mostrar mensaje y cambiar a modo login
      setError(
        "¡Registro exitoso! Por favor verifica tu email antes de iniciar sesión."
      );
      setIsRegistering(false);
      onRegisterSuccess();
    } catch (err) {
      console.error("Error al registrarse:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Error desconocido al registrarse");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center space-y-2 pb-4 sm:pb-6">
        <CardTitle className="flex items-center justify-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
          {isRegistering ? "Registrar Cuenta" : "Inicio de Sesión"}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm lg:text-base">
          {isRegistering
            ? "Crea una cuenta para registrar asistencias"
            : "Ingresa como profesor para registrar asistencias"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        {/* Credenciales de prueba */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-800">
              <p className="font-medium mb-1">Credenciales de prueba:</p>
              <p className="font-mono text-xs break-all">
                fernandoladera1211@gmail.com
              </p>
              <p className="font-mono text-xs">password123</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          {isRegistering && (
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors"
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors"
              placeholder="••••••••"
            />
          </div>

          {isRegistering && (
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <Key className="h-3 w-3 sm:h-4 sm:w-4" />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors"
                placeholder="••••••••"
              />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs sm:text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Botones */}
        <div className="space-y-3 sm:space-y-4">
          <Button
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-base"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : isRegistering ? (
              <>
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                Registrarse
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                Iniciar sesión
              </>
            )}
          </Button>

          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <Button
              variant="link"
              className="text-xs sm:text-sm p-0 h-auto underline-offset-4"
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={loading}
            >
              {isRegistering
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </Button>

            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="text-xs sm:text-sm px-4 py-2"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
