
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Info,
  LogIn,
} from "lucide-react";

return(
    {/* Pantalla de inicio de sesión */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleLogin}
                    disabled={loginLoading}
                    className="flex items-center gap-2"
                  >
                    {loginLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Iniciar sesión
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowLogin(false)}
                    disabled={loginLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

);