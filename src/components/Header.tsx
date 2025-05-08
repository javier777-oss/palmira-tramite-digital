
import { Link } from "react-router-dom";
import { Bell, Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "../services/notificacionService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string, lastname: string) => {
    return (name.charAt(0) + lastname.charAt(0)).toUpperCase();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-palmira-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">Palmira</h1>
              <p className="text-xs text-gray-500">Trámites Digitales</p>
            </div>
          </Link>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 top-16 bg-white shadow-md rounded-md p-4 w-64 z-50">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(user.nombre, user.apellido)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${user.nombre} ${user.apellido}`}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="block p-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/mis-tramites"
                      className="block p-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mis Trámites
                    </Link>
                    {isAdmin && (
                      <>
                        <hr />
                        <Link
                          to="/admin"
                          className="block p-2 hover:bg-gray-100 rounded-md"
                          onClick={() => setMenuOpen(false)}
                        >
                          Panel Admin
                        </Link>
                        <Link
                          to="/admin/tramites"
                          className="block p-2 hover:bg-gray-100 rounded-md"
                          onClick={() => setMenuOpen(false)}
                        >
                          Revisar Trámites
                        </Link>
                      </>
                    )}
                    <hr />
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menú desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/mis-tramites">
                <Button variant="ghost">Mis Trámites</Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="text-center py-2 text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:underline">
                      Ver todas las notificaciones
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(user.nombre, user.apellido)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Panel Admin</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/tramites">Revisar Trámites</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Mi Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mis-tramites">Mis Trámites</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" className="bg-palmira-600 text-white hover:bg-palmira-700">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
