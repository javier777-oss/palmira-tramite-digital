
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  tipoUsuario: 'solicitante' | 'funcionario' | 'admin';
  telefono?: string;
  documento?: string;
  tipoDocumento?: string;
  fechaRegistro: string;
}

export interface Documento {
  id: string;
  nombre: string;
  url: string;
  tipoDocumento: string;
  fechaCarga: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  comentarios?: string;
}

export interface Tramite {
  id: string;
  tipoTramite: string;
  descripcion?: string;
  usuarioId: string;
  estado: 'iniciado' | 'documentos_cargados' | 'en_revision' | 'req_documentos' | 'aprobado' | 'rechazado';
  fechaCreacion: string;
  fechaActualizacion: string;
  documentos: Documento[];
  historial: HistorialTramite[];
  asignado?: string;
}

export interface HistorialTramite {
  id: string;
  tramiteId: string;
  fecha: string;
  estado: string;
  comentarios?: string;
  usuarioId: string;
}

export interface Notificacion {
  id: string;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tramiteId?: string;
}

export type TipoTramite = {
  id: string;
  nombre: string;
  descripcion: string;
  documentosRequeridos: {
    nombre: string;
    descripcion: string;
    requerido: boolean;
  }[];
}
