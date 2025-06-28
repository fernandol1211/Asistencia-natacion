import Header from "../components/Header";
import type { Session } from "@supabase/supabase-js"; // Importación añadida

interface AboutPageProps {
  session?: Session | null;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

export default function AboutPage({
  session,
  onLogout,
  onLoginClick,
}: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        session={session}
        onLogout={onLogout || (() => {})}
        onLoginClick={onLoginClick || (() => {})}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Acerca de Juventus Academy
          </h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-lg">
              Juventus Academy es un sistema de gestión deportiva diseñado para
              optimizar el control de asistencias en academias y clubes
              deportivos.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Nuestra Misión</h2>
            <p>
              Proporcionar herramientas innovadoras que faciliten la
              administración deportiva, permitiendo a entrenadores y personal
              enfocarse en lo que realmente importa: el desarrollo de sus
              atletas.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              Características Principales
            </h2>
            <ul className="space-y-2">
              <li>Registro de asistencias en tiempo real</li>
              <li>Seguimiento detallado de participación</li>
              <li>Reportes estadísticos personalizados</li>
              <li>Gestión de múltiples grupos y categorías</li>
              <li>Acceso seguro con autenticación robusta</li>
            </ul>

            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold mb-2">
                ¿Por qué elegirnos?
              </h3>
              <p>
                Nuestra solución está diseñada específicamente para academias
                deportivas, con un enfoque en usabilidad, seguridad y
                eficiencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
