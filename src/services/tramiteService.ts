
import { Tramite, Documento, TipoTramite } from '../types';

// Datos mock de tipos de trámites disponibles
const tiposTramite: TipoTramite[] = [
  {
    id: '1',
    nombre: 'Licencia de Funcionamiento EPBM',
    descripcion: 'Licencia para el funcionamiento de Establecimientos Públicos y Privados de Básica y Media',
    documentosRequeridos: [
      { 
        nombre: 'Formulario de solicitud', 
        descripcion: 'Formato oficial debidamente diligenciado', 
        requerido: true 
      },
      { 
        nombre: 'Proyecto Educativo Institucional (PEI)', 
        descripcion: 'Documento completo según lineamientos del MEN', 
        requerido: true 
      },
      { 
        nombre: 'Concepto uso de suelos', 
        descripcion: 'Expedido por Planeación Municipal', 
        requerido: true 
      },
      { 
        nombre: 'Certificado de Tradición y Libertad', 
        descripcion: 'Del inmueble donde funcionará el establecimiento', 
        requerido: true 
      },
      { 
        nombre: 'Concepto sanitario favorable', 
        descripcion: 'Expedido por la Secretaría de Salud', 
        requerido: true 
      },
      { 
        nombre: 'Licencia de construcción', 
        descripcion: 'Para uso educativo expedida por Planeación Municipal', 
        requerido: true 
      },
      { 
        nombre: 'Plan de prevención de desastres', 
        descripcion: 'Aprobado por autoridad competente', 
        requerido: true 
      }
    ]
  },
  {
    id: '2',
    nombre: 'Ampliación de Licencia EPBM',
    descripcion: 'Ampliación de licencia para nuevos grados o niveles educativos',
    documentosRequeridos: [
      { 
        nombre: 'Formulario de ampliación', 
        descripcion: 'Formato oficial de solicitud de ampliación', 
        requerido: true 
      },
      { 
        nombre: 'Actualización del PEI', 
        descripcion: 'Con los ajustes para los nuevos grados o niveles', 
        requerido: true 
      },
      { 
        nombre: 'Certificado de capacidad instalada', 
        descripcion: 'Que demuestre la capacidad para atender nuevos estudiantes', 
        requerido: true 
      }
    ]
  },
  {
    id: '3',
    nombre: 'Renovación de Licencia EPBM',
    descripcion: 'Renovación de la licencia de funcionamiento existente',
    documentosRequeridos: [
      { 
        nombre: 'Formulario de renovación', 
        descripcion: 'Formato oficial de solicitud de renovación', 
        requerido: true 
      },
      { 
        nombre: 'Informe de gestión académica', 
        descripcion: 'De los últimos 5 años', 
        requerido: true 
      },
      { 
        nombre: 'Certificados de calidad educativa', 
        descripcion: 'Si cuenta con certificaciones', 
        requerido: false 
      }
    ]
  }
];

// Almacenamiento local mock para trámites
const getTramitesFromStorage = (): Tramite[] => {
  const stored = localStorage.getItem('tramites');
  return stored ? JSON.parse(stored) : [];
};

const saveTramitesToStorage = (tramites: Tramite[]) => {
  localStorage.setItem('tramites', JSON.stringify(tramites));
};

export const getTiposTramite = (): TipoTramite[] => {
  return tiposTramite;
};

export const getTipoTramiteById = (id: string): TipoTramite | undefined => {
  return tiposTramite.find(tipo => tipo.id === id);
};

export const createTramite = (tramite: Omit<Tramite, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'historial'>): Tramite => {
  const tramites = getTramitesFromStorage();
  
  const nuevoTramite: Tramite = {
    ...tramite,
    id: `tramite-${Date.now()}`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    historial: [
      {
        id: `hist-${Date.now()}`,
        tramiteId: `tramite-${Date.now()}`,
        fecha: new Date().toISOString(),
        estado: 'iniciado',
        comentarios: 'Trámite iniciado',
        usuarioId: tramite.usuarioId
      }
    ]
  };
  
  tramites.push(nuevoTramite);
  saveTramitesToStorage(tramites);
  
  return nuevoTramite;
};

export const getTramitesByUserId = (userId: string): Tramite[] => {
  const tramites = getTramitesFromStorage();
  return tramites.filter(t => t.usuarioId === userId);
};

export const getAllTramites = (): Tramite[] => {
  return getTramitesFromStorage();
};

export const getTramiteById = (tramiteId: string): Tramite | undefined => {
  const tramites = getTramitesFromStorage();
  return tramites.find(t => t.id === tramiteId);
};

export const updateTramite = (tramiteId: string, updates: Partial<Tramite>, userId: string, comentario?: string): Tramite => {
  const tramites = getTramitesFromStorage();
  const index = tramites.findIndex(t => t.id === tramiteId);
  
  if (index === -1) {
    throw new Error('Trámite no encontrado');
  }
  
  const updatedTramite = {
    ...tramites[index],
    ...updates,
    fechaActualizacion: new Date().toISOString()
  };
  
  // Añadir entrada al historial
  if (updates.estado) {
    updatedTramite.historial = [
      ...tramites[index].historial,
      {
        id: `hist-${Date.now()}`,
        tramiteId: tramiteId,
        fecha: new Date().toISOString(),
        estado: updates.estado,
        comentarios: comentario || `Estado actualizado a ${updates.estado}`,
        usuarioId: userId
      }
    ];
  }
  
  tramites[index] = updatedTramite;
  saveTramitesToStorage(tramites);
  
  return updatedTramite;
};

export const uploadDocumento = (tramiteId: string, documento: Omit<Documento, 'id' | 'fechaCarga' | 'estado'>): Tramite => {
  const tramites = getTramitesFromStorage();
  const index = tramites.findIndex(t => t.id === tramiteId);
  
  if (index === -1) {
    throw new Error('Trámite no encontrado');
  }
  
  const nuevoDocumento: Documento = {
    ...documento,
    id: `doc-${Date.now()}`,
    fechaCarga: new Date().toISOString(),
    estado: 'pendiente'
  };
  
  tramites[index].documentos = [...(tramites[index].documentos || []), nuevoDocumento];
  tramites[index].fechaActualizacion = new Date().toISOString();
  
  if (tramites[index].estado === 'iniciado') {
    tramites[index].estado = 'documentos_cargados';
    tramites[index].historial.push({
      id: `hist-${Date.now()}`,
      tramiteId: tramiteId,
      fecha: new Date().toISOString(),
      estado: 'documentos_cargados',
      comentarios: 'Documentos cargados por el usuario',
      usuarioId: tramites[index].usuarioId
    });
  }
  
  saveTramitesToStorage(tramites);
  
  return tramites[index];
};

export const updateDocumento = (tramiteId: string, documentoId: string, updates: Partial<Documento>, userId: string): Tramite => {
  const tramites = getTramitesFromStorage();
  const tramiteIndex = tramites.findIndex(t => t.id === tramiteId);
  
  if (tramiteIndex === -1) {
    throw new Error('Trámite no encontrado');
  }
  
  const documentoIndex = tramites[tramiteIndex].documentos.findIndex(d => d.id === documentoId);
  
  if (documentoIndex === -1) {
    throw new Error('Documento no encontrado');
  }
  
  tramites[tramiteIndex].documentos[documentoIndex] = {
    ...tramites[tramiteIndex].documentos[documentoIndex],
    ...updates
  };
  
  tramites[tramiteIndex].fechaActualizacion = new Date().toISOString();
  
  const comentario = updates.comentarios || `Documento ${updates.estado === 'aprobado' ? 'aprobado' : 'con observaciones'}`;
  
  tramites[tramiteIndex].historial.push({
    id: `hist-${Date.now()}`,
    tramiteId: tramiteId,
    fecha: new Date().toISOString(),
    estado: 'documento_revisado',
    comentarios: comentario,
    usuarioId: userId
  });
  
  saveTramitesToStorage(tramites);
  
  return tramites[tramiteIndex];
};
