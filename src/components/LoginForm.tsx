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
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Users className="h-6 w-6" />
          {isRegistering ? "Registrar Cuenta" : "Inicio de Sesión"}
        </CardTitle>
        <CardDescription>
          {isRegistering
            ? "Crea una cuenta para registrar asistencias"
            : "Ingresa como profesor para registrar asistencias"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-center text-blue-800">
              <Info className="inline h-4 w-4 mr-2" />
              <strong>Credenciales de prueba:</strong>{" "}
              fernandoladera1211@gmail.com / password123
            </p>
          </div>

          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label className="text-sm font-medium mb-1 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="••••••••"
              />
            </div>

            {isRegistering && (
              <div>
                <label className="text-sm font-medium mb-1 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={isRegistering ? handleRegister : handleLogin}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRegistering ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  Registrarse
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </>
              )}
            </Button>

            <div className="flex justify-between">
              <Button
                variant="link"
                className="text-sm p-0 h-auto"
                onClick={() => setIsRegistering(!isRegistering)}
                disabled={loading}
              >
                {isRegistering
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </Button>

              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
