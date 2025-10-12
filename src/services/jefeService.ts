import { apiService } from './api';

export interface AuditoriaRecord {
  id_auditoria: number;
  id_cliente: number;
  nombre_cliente: string;
  rut_cliente: string;
  id_ejecutiva?: number;
  ejecutiva_nombre?: string;
  accion: string;
  detalles?: string;
  fecha_accion: string;
  usuario_responsable?: number;
  responsable_nombre?: string;
}

export interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  apellido_cliente?: string;
  rut_cliente: string;
  email: string;
  telefono?: string;
  direccion?: string;
  id_empresa: number;
  nombre_empresa: string;
  id_ejecutiva?: number;
  ejecutiva_nombre?: string;
  estado: string;
  total_actividades: number;
}

export interface Empresa {
  id_empresa: number;
  nombre_empresa: string;
  rut: string;
  direccion?: string;
  telefono?: string;
  email_contacto?: string;
  activo: boolean;
  total_ejecutivas?: string;
  total_clientes?: string;
}

export interface Ejecutiva {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: string;
  activo: boolean;
  total_empresas: number;
  total_clientes: number;
  total_actividades: number;
}

export interface DashboardStats {
  totalEmpresas: number;
  totalEjecutivas: number;
  totalClientes: number;
  actividadesMes: number;
  trazabilidadPorEstado: Array<{ estado: string; total: string }>;
  actividadesPorEjecutiva: Array<{ ejecutiva: string; total_actividades: string }>;
  clientesPorEmpresa: Array<{ nombre_empresa: string; total_clientes: string }>;
}

export interface Trazabilidad {
  id_trazabilidad: number;
  id_ejecutiva: number;
  id_empresa: number;
  id_cliente: number;
  tipo_actividad: string;
  descripcion: string;
  fecha_actividad: string;
  estado: string;
  notas: string;
  ejecutiva_nombre: string;
  ejecutiva_activa: boolean;
  nombre_empresa: string;
  nombre_cliente: string;
}

export const jefeService = {
  // Dashboard
  async getStats(): Promise<DashboardStats> {
    return apiService.get('/jefe/stats');
  },

  // Auditoría
  async getAuditoria(): Promise<AuditoriaRecord[]> {
    return apiService.get('/jefe/auditoria');
  },

  // Clientes
  async getClientes(): Promise<Cliente[]> {
    return apiService.get('/jefe/clientes');
  },

  async createCliente(data: any): Promise<any> {
    return apiService.post('/jefe/clientes', data);
  },

  async updateCliente(id: number, data: any): Promise<any> {
    return apiService.put(`/jefe/clientes/${id}`, data);
  },

  async deleteCliente(id: number): Promise<void> {
    return apiService.delete(`/jefe/clientes/${id}`);
  },

  // Ejecutivas
  async getEjecutivas(): Promise<Ejecutiva[]> {
    return apiService.get('/jefe/ejecutivas');
  },

  async getEjecutivaDetalle(id: number): Promise<any> {
    return apiService.get(`/jefe/ejecutivas/${id}`);
  },

  async createEjecutiva(data: any): Promise<any> {
    return apiService.post('/jefe/ejecutivas', data);
  },

  async updateEjecutiva(id: number, data: any): Promise<any> {
    return apiService.put(`/jefe/ejecutivas/${id}`, data);
  },

  // Empresas
  async getEmpresas(): Promise<Empresa[]> {
    return apiService.get('/jefe/empresas');
  },

  async createEmpresa(data: any): Promise<any> {
    return apiService.post('/jefe/empresas', data);
  },

  async updateEmpresa(id: number, data: any): Promise<any> {
    return apiService.put(`/jefe/empresas/${id}`, data);
  },

  async deleteEmpresa(id: number): Promise<void> {
    return apiService.delete(`/jefe/empresas/${id}`);
  },

  async toggleEmpresaEstado(id: number, activo: boolean): Promise<any> {
    return apiService.patch(`/jefe/empresas/${id}/estado`, { activo });
  },

  async getEmpresaEjecutivas(id: number): Promise<any> {
    return apiService.get(`/jefe/empresas/${id}/ejecutivas`);
  },

  async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number): Promise<any> {
    return apiService.post(`/jefe/empresas/${empresaId}/ejecutivas`, { id_ejecutiva: ejecutivaId });
  },

  async removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number): Promise<any> {
    return apiService.delete(`/jefe/empresas/${empresaId}/ejecutivas/${ejecutivaId}`);
  },

  // Trazabilidad
  async getTrazabilidad(filters?: any): Promise<Trazabilidad[]> {
    const params = new URLSearchParams();
    if (filters?.empresa) params.append('empresa', filters.empresa);
    if (filters?.ejecutiva) params.append('ejecutiva', filters.ejecutiva);
    if (filters?.cliente) params.append('cliente', filters.cliente);
    
    return apiService.get(`/jefe/trazabilidad?${params.toString()}`);
  },

  // Perfil
  async getPerfil(): Promise<any> {
    return apiService.get('/jefe/perfil');
  },

  async updatePerfil(data: any): Promise<any> {
    return apiService.put('/jefe/perfil', data);
  },

  async updatePassword(data: any): Promise<any> {
    return apiService.put('/jefe/perfil/password', data);
  }
};