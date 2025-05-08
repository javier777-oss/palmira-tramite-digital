
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // En una aplicación real, estas funciones se conectarían a una API/backend
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulación de una llamada a API
      if (email === "admin@palmira.gov.co" && password === "admin123") {
        const adminUser: User = {
          id: "1",
          email: "admin@palmira.gov.co",
          nombre: "Administrador",
          apellido: "Sistema",
          tipoUsuario: "admin",
          fechaRegistro: new Date().toISOString()
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema de trámites de la Secretaría de Educación de Palmira",
        });
      } else if (email === "funcionario@palmira.gov.co" && password === "func123") {
        const funcionarioUser: User = {
          id: "2",
          email: "funcionario@palmira.gov.co",
          nombre: "Funcionario",
          apellido: "Educación",
          tipoUsuario: "funcionario",
          fechaRegistro: new Date().toISOString()
        };
        setUser(funcionarioUser);
        localStorage.setItem('user', JSON.stringify(funcionarioUser));
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema de trámites de la Secretaría de Educación de Palmira",
        });
      } else if (email && password) {
        // Usuario normal registrado
        const usuarioComun: User = {
          id: Date.now().toString(),
          email,
          nombre: "Usuario",
          apellido: "Registrado",
          tipoUsuario: "solicitante",
          fechaRegistro: new Date().toISOString()
        };
        setUser(usuarioComun);
        localStorage.setItem('user', JSON.stringify(usuarioComun));
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema de trámites de la Secretaría de Educación de Palmira",
        });
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Por favor intente nuevamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulación de registro
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email || '',
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        tipoUsuario: 'solicitante',
        telefono: userData.telefono,
        documento: userData.documento,
        tipoDocumento: userData.tipoDocumento,
        fechaRegistro: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Registro exitoso",
        description: "Su cuenta ha sido creada correctamente",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "No se pudo completar el registro. Por favor intente nuevamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión correctamente",
    });
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.tipoUsuario === 'admin' || user?.tipoUsuario === 'funcionario'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
