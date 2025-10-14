// frontend/src/services/ejecutivaService.ts - CORREGIDO
import { apiService } from "./api";

export interface Stats {
  totalEmpresas: number
  totalClientes: number
  actividadesMes: number
}

export interface Trazabilidad {
  id_trazabilidad: number
  tipo_actividad: string
  descripcion: string
  fecha_actividad: string
  estado: string
  nombre_empresa: string
  nombre_cliente: string | null
}

export interface Empresa {
  id_empresa: number
  nombre_empresa: string
  rut: string
  direccion?: string
  telefono?: string
  email_contacto?: string
  total_clientes?: number
}

export interface Cliente {
  id_cliente: number
  nombre_cliente: string
  rut_cliente: string
  direccion?: string
  telefono?: string
  email?: string
  nombre_empresa: string
  estado: string
}

export const ejecutivaService = {
  // Obtener estadísticas
  async getStats(ejecutivaId: string): Promise<Stats> {
    return apiService.get(`/user-service/ejecutiva/stats?ejecutivaId=${ejecutivaId}`)
  },

  // Obtener trazabilidad
  async getTrazabilidad(ejecutivaId: string): Promise<Trazabilidad[]> {
    return apiService.get(`/traceability-service/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`)
  },

  // Obtener empresas
  async getEmpresas(ejecutivaId: string): Promise<Empresa[]> {
    return apiService.get(`/user-service/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`)
  },

  // Crear empresa
  async createEmpresa(data: {
    nombre_empresa: string
    rut: string
    direccion: string
    telefono: string
    email_contacto: string
    ejecutivaId: string
  }): Promise<Empresa> {
    return apiService.post("/user-service/ejecutiva/empresas", data)
  },

  // Obtener clientes
  async getClientes(ejecutivaId: string): Promise<Cliente[]> {
    return apiService.get(`/user-service/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`)
  },

  // Crear cliente
  async createCliente(data: {
    id_empresa: string
    id_ejecutiva: string
    nombre_cliente: string
    rut_cliente: string
    direccion: string
    telefono: string
    email: string
  }): Promise<Cliente> {
    return apiService.post("/user-service/ejecutiva/clientes", data)
  },

  // Crear actividad de trazabilidad
  async createTrazabilidad(data: {
    id_ejecutiva: string
    id_empresa: string
    id_cliente?: string
    tipo_actividad: string
    descripcion: string
    estado: string
    notas?: string
  }): Promise<Trazabilidad> {
    return apiService.post("/traceability-service/ejecutiva/trazabilidad", data)
  }
}