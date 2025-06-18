// LoginForm.tsx
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
import { LogIn, Info, Users } from "lucide-react";
import { supabase } from "../lib/supabase"; // Asegúrate de exportar supabase desde tu archivo principal

interface LoginFormProps {
  onCancel: () => void;
  onLoginSuccess: () => void;
}

export default function LoginForm({
  onCancel,
  onLoginSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Manejar diferentes tipos de errores
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
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Users className="h-6 w-6" />
          Inicio de Sesión
        </CardTitle>
        <CardDescription>
          Ingresa como profesor para registrar asistencias
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
            <div>
              <label className="block text-sm font-medium mb-1">
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
              <label className="block text-sm font-medium mb-1">
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
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </>
              )}
            </Button>

            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
