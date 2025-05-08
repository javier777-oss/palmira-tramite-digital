
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-palmira-900 to-palmira-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Secretaría de Educación de Palmira
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Plataforma Digital de Trámites Educativos
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link to="/login" className="w-full">
              <Button variant="default" size="lg" className="w-full bg-white text-palmira-700 hover:bg-gray-100">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register" className="w-full">
              <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-palmira-700">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 bg-palmira-100 text-palmira-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Licencia de Funcionamiento</h3>
              <p className="text-gray-600 mb-4">
                Solicita la licencia de funcionamiento para Establecimientos Educativos de forma digital.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 bg-palmira-100 text-palmira-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Ampliación y Renovación</h3>
              <p className="text-gray-600 mb-4">
                Gestiona la ampliación y renovación de licencias para nuevos niveles educativos.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 bg-palmira-100 text-palmira-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9.75M8.25 2.25h6.755c.69 0 1.35.275 1.837.761l3.397 3.398a2.625 2.625 0 0 1 .761 1.836v2.005"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Seguimiento de Trámites</h3>
              <p className="text-gray-600 mb-4">
                Monitorea el estado de tus solicitudes y recibe notificaciones en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-palmira-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-lg">1</span>
              </div>
              <h3 className="font-bold mb-2">Regístrate</h3>
              <p className="text-gray-600 text-sm">
                Crea una cuenta para acceder a la plataforma.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-palmira-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-lg">2</span>
              </div>
              <h3 className="font-bold mb-2">Inicia el trámite</h3>
              <p className="text-gray-600 text-sm">
                Selecciona el tipo de trámite que necesitas realizar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-palmira-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-lg">3</span>
              </div>
              <h3 className="font-bold mb-2">Sube documentos</h3>
              <p className="text-gray-600 text-sm">
                Adjunta los documentos requeridos para tu trámite.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-palmira-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-lg">4</span>
              </div>
              <h3 className="font-bold mb-2">Recibe respuesta</h3>
              <p className="text-gray-600 text-sm">
                Sigue el estado de tu trámite y recibe la aprobación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-palmira-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="max-w-xl mx-auto mb-8">
            Inicia sesión o regístrate para comenzar a gestionar tus trámites educativos de forma rápida y eficiente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="default" size="lg" className="w-full bg-white text-palmira-700 hover:bg-gray-100">
                Registrarse ahora
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-palmira-700">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
