// src/components/TestConnection.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Member } from "../lib/supabaseClient"; // Importación específica para tipos
const TestConnection = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setLoading(true);

      // 1. Crear tabla de prueba (solo ejecutar una vez)
      await supabase
        .from("test_table")
        .insert([{ name: "Club Natación Madrid" }]);

      // 2. Leer datos
      const { data, error: readError } = await supabase
        .from("test_table")
        .select("*");

      if (readError) throw new Error(readError.message);

      // 3. Verificar datos
      if (!data || data.length === 0) {
        throw new Error("No se encontraron datos en la tabla de prueba");
      }

      setMembers(data as Member[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

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
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 text-green-800 rounded-lg">
      <h3 className="font-bold">✅ Conexión exitosa con Supabase!</h3>

      <div className="mt-4">
        <p className="font-medium">Datos recuperados:</p>
        <ul className="mt-2 space-y-2">
          {members.map((member) => (
            <li key={member.id} className="bg-white p-3 rounded shadow-sm">
              <span className="font-mono">{member.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestConnection;
