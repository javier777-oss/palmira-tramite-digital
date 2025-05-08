
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Páginas
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NuevoTramite from "./pages/NuevoTramite";
import MisTramites from "./pages/MisTramites";
import DetalleTramite from "./pages/DetalleTramite";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTramites from "./pages/AdminTramites";
import AdminRevisarTramite from "./pages/AdminRevisarTramite";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas para usuarios */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/nuevo-tramite" element={<ProtectedRoute><NuevoTramite /></ProtectedRoute>} />
            <Route path="/mis-tramites" element={<ProtectedRoute><MisTramites /></ProtectedRoute>} />
            <Route path="/tramite/:id" element={<ProtectedRoute><DetalleTramite /></ProtectedRoute>} />
            
            {/* Rutas protegidas para administradores */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/tramites" element={<AdminRoute><AdminTramites /></AdminRoute>} />
            <Route path="/admin/revisar-tramite/:id" element={<AdminRoute><AdminRevisarTramite /></AdminRoute>} />
            
            {/* Ruta para página no encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
