
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-palmira-100 text-palmira-800 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl font-bold">404</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/">
            <Button className="bg-palmira-600 hover:bg-palmira-700">
              Volver a la página principal
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
