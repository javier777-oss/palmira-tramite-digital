
import { Notificacion } from '../types';

// Almacenamiento local mock para notificaciones
const getNotificacionesFromStorage = (): Notificacion[] => {
  const stored = localStorage.getItem('notificaciones');
  return stored ? JSON.parse(stored) : [];
};

const saveNotificacionesToStorage = (notificaciones: Notificacion[]) => {
  localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
};

export const createNotificacion = (notificacion: Omit<Notificacion, 'id' | 'fecha' | 'leida'>): Notificacion => {
  const notificaciones = getNotificacionesFromStorage();
  
  const nuevaNotificacion: Notificacion = {
    ...notificacion,
    id: `notif-${Date.now()}`,
    fecha: new Date().toISOString(),
    leida: false
  };
  
  notificaciones.push(nuevaNotificacion);
  saveNotificacionesToStorage(notificaciones);
  
  return nuevaNotificacion;
};

export const getNotificacionesByUserId = (userId: string): Notificacion[] => {
  const notificaciones = getNotificacionesFromStorage();
  return notificaciones.filter(n => n.usuarioId === userId).sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });
};

export const markAsRead = (notificacionId: string): Notificacion | undefined => {
  const notificaciones = getNotificacionesFromStorage();
  const index = notificaciones.findIndex(n => n.id === notificacionId);
  
  if (index === -1) {
    return undefined;
  }
  
  notificaciones[index].leida = true;
  saveNotificacionesToStorage(notificaciones);
  
  return notificaciones[index];
};

export const markAllAsRead = (userId: string): number => {
  const notificaciones = getNotificacionesFromStorage();
  let count = 0;
  
  const updated = notificaciones.map(n => {
    if (n.usuarioId === userId && !n.leida) {
      count++;
      return { ...n, leida: true };
    }
    return n;
  });
  
  saveNotificacionesToStorage(updated);
  
  return count;
};

export const deleteNotificacion = (notificacionId: string): boolean => {
  const notificaciones = getNotificacionesFromStorage();
  const updated = notificaciones.filter(n => n.id !== notificacionId);
  
  if (updated.length === notificaciones.length) {
    return false;
  }
  
  saveNotificacionesToStorage(updated);
  
  return true;
};

export const getUnreadCount = (userId: string): number => {
  const notificaciones = getNotificacionesFromStorage();
  return notificaciones.filter(n => n.usuarioId === userId && !n.leida).length;
};
