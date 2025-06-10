import TestConnection from "./components/TestConnection";
import { Button } from "./components/ui/button.tsx";

function App() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        Sistema de Asistencia - Club de Natación
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Verificación de Conexión</h2>
        <TestConnection />
        <div className="flex justify-center mt-3">
          <Button variant="outline">Prueba</Button>
        </div>
      </div>

      {/* Aquí irá el resto de tu aplicación */}
    </div>
  );
}

export default App;
