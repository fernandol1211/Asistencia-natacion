import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Contáctanos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Información de Contacto
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">soporte@juventusacademy.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Teléfono</h3>
                  <p className="text-gray-600">+1 (234) 567-8900</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Dirección</h3>
                  <p className="text-gray-600">
                    Av. Deportiva 1234
                    <br />
                    Ciudad Deportiva
                    <br />
                    CP 12345
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Horario de Atención</h2>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span>Lunes - Viernes</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Sábados</span>
                <span>9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Domingos</span>
                <span>Cerrado</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Soporte Técnico</h3>
              <p className="text-sm text-gray-600">
                Para asistencia técnica, contáctanos durante nuestro horario de
                atención o envía un correo a soporte@juventusacademy.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
