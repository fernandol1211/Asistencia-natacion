export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Bienvenido al Sistema de Asistencias
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Gestiona las asistencias de tus atletas de manera eficiente y
          profesional
        </p>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            ¿Qué puedes hacer?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <li className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 font-bold mb-2">Registro</div>
              <p>Registra asistencias en tiempo real</p>
            </li>
            <li className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 font-bold mb-2">Seguimiento</div>
              <p>Controla la participación de tus atletas</p>
            </li>
            <li className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 font-bold mb-2">Reportes</div>
              <p>Genera informes detallados de asistencia</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
