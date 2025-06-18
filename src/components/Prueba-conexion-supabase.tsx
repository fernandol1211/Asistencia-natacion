// src/components/TestConnection.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Profesores } from "../lib/supabase";

const TestConnection = () => {
  const [profesores, setprofesores] = useState<Profesores[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Verificar conexión con Supabase
      const { error: connectionError } = await supabase
        .from("profesores")
        .select("id")
        .limit(1);

      if (connectionError) throw new Error(connectionError.message);

      // 2. Leer todos los datos
      const { data, error: readError } = await supabase
        .from("profesores")
        .select("*")
        .order("nombre", { ascending: true });

      if (readError) throw new Error(readError.message);

      // 3. Manejar caso de datos vacíos
      if (!data || data.length === 0) {
        setprofesores([]);
        return;
      }

      setprofesores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  console.log(profesores);

  useEffect(() => {
    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700">Verificando conexión con Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        <h3 className="font-bold">❌ Error de conexión</h3>
        <p>{error}</p>
        <button
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={testConnection}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 text-green-800 rounded-lg">
      <h3 className="font-bold">✅ Conexión exitosa con Supabase!</h3>

      <div className="mt-4">
        <p className="font-medium">
          {profesores.length > 0
            ? `Datos recuperados (${profesores.length} registros):`
            : "La tabla existe pero no contiene registros"}
        </p>

        {profesores.length > 0 && (
          <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {profesores.map((member) => (
              <li
                key={member.id}
                className="bg-white p-3 rounded shadow-sm border border-gray-200"
              >
                <div className="font-bold text-gray-800">{member.name}</div>
                <div className="text-sm text-gray-600">{member.email}</div>
                <div className="text-xs text-gray-400 mt-1">
                  ID: {member.id}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestConnection;
