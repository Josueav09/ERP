// frontend/src/services/ejecutivaService.ts - CORREGIDO
// import { apiService } from "./api";

// export interface Stats {
//   totalEmpresas: number
//   totalClientes: number
//   actividadesMes: number
// }

// export interface Trazabilidad {
//   id_trazabilidad: number
//   tipo_actividad: string
//   descripcion: string
//   fecha_actividad: string
//   estado: string
//   nombre_empresa: string
//   nombre_cliente: string | null
// }

// export interface Empresa {
//   id_empresa: number
//   nombre_empresa: string
//   rut: string
//   direccion?: string
//   telefono?: string
//   email_contacto?: string
//   total_clientes?: number
// }

// export interface Cliente {
//   id_cliente: number
//   nombre_cliente: string
//   rut_cliente: string
//   direccion?: string
//   telefono?: string
//   email?: string
//   nombre_empresa: string
//   estado: string
// }

// export const ejecutivaService = {
//   // Obtener estadísticas
//   async getStats(ejecutivaId: string): Promise<Stats> {
//     return apiService.get(`/user-service/ejecutiva/stats?ejecutivaId=${ejecutivaId}`)
//   },

//   // Obtener trazabilidad
//   async getTrazabilidad(ejecutivaId: string): Promise<Trazabilidad[]> {
//     return apiService.get(`/traceability-service/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`)
//   },

//   // Obtener empresas
//   async getEmpresas(ejecutivaId: string): Promise<Empresa[]> {
//     return apiService.get(`/user-service/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`)
//   },

//   // Crear empresa
//   async createEmpresa(data: {
//     nombre_empresa: string
//     rut: string
//     direccion: string
//     telefono: string
//     email_contacto: string
//     ejecutivaId: string
//   }): Promise<Empresa> {
//     return apiService.post("/user-service/ejecutiva/empresas", data)
//   },

//   // Obtener clientes
//   async getClientes(ejecutivaId: string): Promise<Cliente[]> {
//     return apiService.get(`/user-service/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`)
//   },

//   // Crear cliente
//   async createCliente(data: {
//     id_empresa: string
//     id_ejecutiva: string
//     nombre_cliente: string
//     rut_cliente: string
//     direccion: string
//     telefono: string
//     email: string
//   }): Promise<Cliente> {
//     return apiService.post("/user-service/ejecutiva/clientes", data)
//   },

//   // Crear actividad de trazabilidad
//   async createTrazabilidad(data: {
//     id_ejecutiva: string
//     id_empresa: string
//     id_cliente?: string
//     tipo_actividad: string
//     descripcion: string
//     estado: string
//     notas?: string
//   }): Promise<Trazabilidad> {
//     return apiService.post("/traceability-service/ejecutiva/trazabilidad", data)
//   }
// }

// frontend/src/services/ejecutivaService.ts - CORREGIDO
import { apiService } from "./api";

export interface Stats {
  totalEmpresas: number
  totalClientes: number
  actividadesMes: number
  revenueGenerado: number
  empresaAsignada: boolean
  pipelineCount?: number
}

export interface Trazabilidad {
  id_trazabilidad: number
  tipo_contacto: string  // ✅ Cambiado de tipo_actividad
  fecha_contacto: string // ✅ Cambiado de fecha_actividad
  resultado_contacto: string // ✅ Cambiado de estado
  empresa_proveedora: string // ✅ Cambiado de nombre_empresa
  cliente_final: string // ✅ Cambiado de nombre_cliente
  contacto: string
  reunion_agendada: boolean
  fecha_reunion?: string
  pasa_embudo_ventas: boolean
  nombre_oportunidad?: string
  etapa_oportunidad?: string
  monto_total_sin_imp?: number
  observaciones?: string
  informacion_importante?: string
}

export interface Empresa {
  id_empresa_prov: number // ✅ Cambiado de id_empresa
  razon_social: string // ✅ Cambiado de nombre_empresa
  ruc: string
  direccion?: string
  telefono?: string
  correo?: string // ✅ Cambiado de email_contacto
  total_clientes?: number
}

export interface Cliente {
  id_cliente_final: number // ✅ Cambiado de id_cliente
  razon_social: string // ✅ Cambiado de nombre_cliente
  ruc: string // ✅ Cambiado de rut_cliente
  direccion?: string
  telefono?: string
  correo?: string // ✅ Cambiado de email
  empresa_proveedora?: string
  total_actividades?: number
  contacto_principal?: {
    nombre_completo: string
    cargo?: string
    correo?: string
  }
}

export const ejecutivaService = {
  // Obtener estadísticas
  ///user-service - /traceability-service
  async getStats(ejecutivaId: string): Promise<Stats> {
    return apiService.get(`/ejecutiva/stats?ejecutivaId=${ejecutivaId}`)
  },

  // Obtener trazabilidad
  async getTrazabilidad(ejecutivaId: string): Promise<Trazabilidad[]> {
    return apiService.get(`/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`)
  },

  // Obtener empresas
  async getEmpresas(ejecutivaId: string): Promise<Empresa[]> {
    return apiService.get(`/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`)
  },

  // Crear empresa
  async createEmpresa(data: {
    razon_social: string // ✅ Cambiado
    ruc: string
    direccion: string
    telefono: string
    correo: string // ✅ Cambiado
    ejecutivaId: string
  }): Promise<Empresa> {
    return apiService.post("/ejecutiva/empresas", data)
  },

  // Obtener clientes
  async getClientes(ejecutivaId: string): Promise<Cliente[]> {
    return apiService.get(`/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`)
  },

  // Crear cliente
  async createCliente(data: {
    id_empresa: string
    id_ejecutiva: string
    razon_social: string // ✅ Cambiado
    ruc: string // ✅ Cambiado
    direccion: string
    telefono: string
    correo: string // ✅ Cambiado
  }): Promise<Cliente> {
    return apiService.post("/ejecutiva/clientes", data)
  },

  // Crear trazabilidad
  async createTrazabilidad(data: {
    id_ejecutiva: string
    id_empresa_prov: string // ✅ Cambiado
    id_cliente_final: string // ✅ Cambiado
    id_contacto: string
    tipo_contacto: string // ✅ Cambiado
    fecha_contacto: Date // ✅ Cambiado
    resultado_contacto: string // ✅ Cambiado
    informacion_importante?: string
    reunion_agendada?: boolean
    fecha_reunion?: Date
    participantes?: string
    se_dio_reunion?: boolean
    resultados_reunion?: string
    pasa_embudo_ventas?: boolean
    nombre_oportunidad?: string
    etapa_oportunidad?: string
    producto_ofrecido?: string
    monto_total_sin_imp?: number
    probabilidad_cierre?: number
    observaciones?: string
  }): Promise<Trazabilidad> {
    return apiService.post("/ejecutiva/trazabilidad", data)
  }
}