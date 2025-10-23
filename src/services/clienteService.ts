import { apiService } from './api';

export interface ClienteStats {
  cliente: {
    nombre_cliente: string;
    nombre_empresa: string;
    ejecutiva_nombre: string;
    ejecutiva_email: string;
  };
  totalActividades: number;
  completadas: number;
  enProceso: number;
  rendimiento: number;
}

export interface Trazabilidad {
  id_trazabilidad: number;
  tipo_actividad: string;
  descripcion: string;
  fecha_actividad: string;
  estado: string;
  notas: string | null;
  ejecutiva_nombre: string;
  nombre_empresa: string;
}

export const clienteService = {
  // Dashboard Stats
  async getStats(clienteUsuarioId: string): Promise<ClienteStats> {
    return apiService.get(`/empresa/dashboard/stats?clienteUsuarioId=${clienteUsuarioId}`);
  },

  // Trazabilidad
  async getTrazabilidad(clienteUsuarioId: string): Promise<Trazabilidad[]> {
    return apiService.get(`/traceability/cliente/trazabilidad?clienteUsuarioId=${clienteUsuarioId}`);
  },

  // Ejecutiva Info
  async getEjecutivaInfo(clienteUsuarioId: string): Promise<any> {
    return apiService.get(`/cliente/ejecutiva?clienteUsuarioId=${clienteUsuarioId}`);
  },

  // Actividades
  async getActividades(clienteUsuarioId: string): Promise<any[]> {
    return apiService.get(`/traceability/cliente/actividades?clienteUsuarioId=${clienteUsuarioId}`);
  }
};