
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 text-gray-600 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-palmira-800">Palmira Trámites Digitales</h3>
            <p className="text-sm mb-4">
              Plataforma oficial de la Secretaría de Educación de Palmira para la gestión de trámites relacionados con la educación en el municipio.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-palmira-600">Inicio</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-palmira-600">Iniciar sesión</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-palmira-600">Registrarse</Link>
              </li>
              <li>
                <a href="https://www.palmira.gov.co" target="_blank" rel="noopener noreferrer" className="hover:text-palmira-600">
                  Sitio web de Palmira
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>Secretaría de Educación</li>
              <li>Calle 30 #28-63</li>
              <li>Palmira, Valle del Cauca</li>
              <li>Teléfono: (602) 2339300</li>
              <li>Email: educacion@palmira.gov.co</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm">
          <p>&copy; {year} Secretaría de Educación - Alcaldía de Palmira. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
