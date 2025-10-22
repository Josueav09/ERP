// frontend/src/services/ejecutivaService.ts - CORREGIDO
// import { apiService } from "./api";

// export interface Stats {
//   totalEmpresas: number
//   totalClientes: number
//   actividadesMes: number
//   revenueGenerado: number
//   empresaAsignada: boolean
//   pipelineCount?: number
// }

// export interface Trazabilidad {
//   id_trazabilidad: number
//   tipo_contacto: string  // ✅ Cambiado de tipo_actividad
//   fecha_contacto: string // ✅ Cambiado de fecha_actividad
//   resultado_contacto: string // ✅ Cambiado de estado
//   empresa_proveedora: string // ✅ Cambiado de nombre_empresa
//   cliente_final: string // ✅ Cambiado de nombre_cliente
//   contacto: string
//   reunion_agendada: boolean
//   fecha_reunion?: string
//   pasa_embudo_ventas: boolean
//   nombre_oportunidad?: string
//   etapa_oportunidad?: string
//   monto_total_sin_imp?: number
//   observaciones?: string
//   informacion_importante?: string
// }

// export interface Empresa {
//   id_empresa_prov: number // ✅ Cambiado de id_empresa
//   razon_social: string // ✅ Cambiado de nombre_empresa
//   ruc: string
//   direccion?: string
//   telefono?: string
//   correo?: string // ✅ Cambiado de email_contacto
//   total_clientes?: number
// }

// export interface Cliente {
//   id_cliente_final: number // ✅ Cambiado de id_cliente
//   razon_social: string // ✅ Cambiado de nombre_cliente
//   ruc: string // ✅ Cambiado de rut_cliente
//   direccion?: string
//   telefono?: string
//   correo?: string // ✅ Cambiado de email
//   empresa_proveedora?: string
//   total_actividades?: number
//   contacto_principal?: {
//     nombre_completo: string
//     cargo?: string
//     correo?: string
//   }
// }

// export const ejecutivaService = {
//   // Obtener estadísticas
//   ///user-service - /traceability-service
//   async getStats(ejecutivaId: string): Promise<Stats> {
//     return apiService.get(`/ejecutiva/stats?ejecutivaId=${ejecutivaId}`)
//   },

//   // Obtener trazabilidad
//   async getTrazabilidad(ejecutivaId: string): Promise<Trazabilidad[]> {
//     return apiService.get(`/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`)
//   },

//   // Obtener empresas
//   async getEmpresas(ejecutivaId: string): Promise<Empresa[]> {
//     return apiService.get(`/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`)
//   },

//   // Crear empresa
//   async createEmpresa(data: {
//     razon_social: string
//     ruc: string
//     direccion: string
//     telefono: string
//     correo: string
//     ejecutivaId: string
//   }): Promise<Empresa> {
//     return apiService.post("/ejecutiva/empresas/registrar", data)
//   },

//   // Obtener clientes
//   async getClientes(ejecutivaId: string): Promise<Cliente[]> {
//     return apiService.get(`/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`)
//   },

//   // Crear cliente
//   async createCliente(data: {
//     id_empresa: string
//     id_ejecutiva: string
//     razon_social: string // ✅ Cambiado
//     ruc: string // ✅ Cambiado
//     direccion: string
//     telefono: string
//     correo: string // ✅ Cambiado
//   }): Promise<Cliente> {
//     return apiService.post("/ejecutiva/clientes", data)
//   },

//   // Crear trazabilidad
//   async createTrazabilidad(data: {
//     id_ejecutiva: string
//     id_empresa_prov: string // ✅ Cambiado
//     id_cliente_final: string // ✅ Cambiado
//     id_contacto: string
//     tipo_contacto: string // ✅ Cambiado
//     fecha_contacto: Date // ✅ Cambiado
//     resultado_contacto: string // ✅ Cambiado
//     informacion_importante?: string
//     reunion_agendada?: boolean
//     fecha_reunion?: Date
//     participantes?: string
//     se_dio_reunion?: boolean
//     resultados_reunion?: string
//     pasa_embudo_ventas?: boolean
//     nombre_oportunidad?: string
//     etapa_oportunidad?: string
//     producto_ofrecido?: string
//     monto_total_sin_imp?: number
//     probabilidad_cierre?: number
//     observaciones?: string
//   }): Promise<Trazabilidad> {
//     return apiService.post("/ejecutiva/trazabilidad", data)
//   }
// }

// frontend/src/services/ejecutivaService.ts - ACTUALIZADO
import { apiService } from "./api";

// Para createCliente
export interface CreateClienteData {
  razon_social: string
  ruc: string
  direccion: string
  telefono: string
  correo: string
  ejecutivaId: string
  pagina_web?: string
  pais?: string
  departamento?: string
  provincia?: string
  linkedin?: string
  grupo_economico?: string
  rubro?: string
  sub_rubro?: string
  tamanio_empresa?: string
  facturacion_anual?: string
  cantidad_empleados?: string
}

// Para createPersonaContacto
export interface CreateContactoData {
  nombre_completo: string
  cargo: string
  correo: string
  telefono: string
  id_cliente_final: string
  ejecutivaId: string
  dni?: string
  linkedin?: string
}

export interface CreateTrazabilidadData {
  id_ejecutiva: string
  id_empresa_prov: string
  id_cliente_final: string
  id_contacto: string
  tipo_contacto: string
  fecha_contacto: Date
  resultado_contacto: string
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
}

export interface TrazabilidadStats {
  totalContactos: number
  oportunidadesGeneradas: number
  ventasGanadas: number
  tasaConversion: number
  montoTotal: number
  enProceso: number
}

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
  tipo_contacto: string
  fecha_contacto: string
  resultado_contacto: string
  empresa_proveedora: string
  cliente_final: string
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
  id_empresa_prov: number
  razon_social: string
  ruc: string
  direccion?: string
  telefono?: string
  correo?: string
  total_clientes?: number
  estado?: string
  pais?: string
  departamento?: string
  provincia?: string
  linkedin?: string
  rubro?: string
  sub_rubro?: string
  tamanio_empresa?: string
  fecha_creacion?: string
}

export interface EmpresaRegistrada extends Empresa {
  esta_asignada: boolean
  puede_crear_clientes: boolean
}

export interface Cliente {
  id_cliente_final: number
  razon_social: string
  ruc: string
  direccion?: string
  telefono?: string
  correo?: string
  empresa_proveedora?: string
  total_actividades?: number
  contacto_principal?: {
    nombre_completo: string
    cargo?: string
    correo?: string
  }
  ultima_actividad?: {
    fecha: string
    tipo: string
    resultado: string
    persona_contacto?: {
      id: number
      nombre_completo: string
      email: string
      telefono: string
    }
  }
}

export interface PersonaContacto {
  id_contacto: number
  nombre_completo: string
  cargo?: string
  correo?: string
  telefono?: string
  linkedin?: string
}

export interface PipelineOportunidad {
  id: number
  nombre_oportunidad: string
  cliente: string
  persona_contacto: string
  etapa: string
  monto: number
  probabilidad: number
  fecha_cierre_esperado: string
  producto_ofrecido?: string
  fecha_inicio_etapa?: string
}

export interface ActividadReciente {
  id: number
  fecha: string
  tipo_contacto: string
  resultado: string
  cliente: string
  persona_contacto: {
    id: number
    nombre_completo: string
    email: string
    telefono: string
  }
  oportunidad?: string
  etapa?: string
  observaciones?: string
}

export const ejecutivaService = {
  // Obtener estadísticas
  async getStats(ejecutivaId: string): Promise<Stats> {
        console.log('📊 getStats called for ejecutiva:', ejecutivaId)
    return apiService.get(`/ejecutiva/stats?ejecutivaId=${ejecutivaId}`)
  },

    // ✅ Obtener estadísticas de trazabilidad (desde traceability-service)
  async getTrazabilidadStats(ejecutivaId: string): Promise<TrazabilidadStats> {
    console.log('📊 getTrazabilidadStats called for ejecutiva:', ejecutivaId)
    return apiService.get(`/ejecutiva/trazabilidad/stats?ejecutivaId=${ejecutivaId}`)
  },


  // Obtener trazabilidad
  async getTrazabilidad(ejecutivaId: string): Promise<Trazabilidad[]> {
        console.log('🔍 getTrazabilidad called for ejecutiva:', ejecutivaId)
    return apiService.get(`/ejecutiva/trazabilidad?ejecutivaId=${ejecutivaId}`)
  },

  // Obtener empresa asignada
  async getEmpresaAsignada(ejecutivaId: string): Promise<Empresa | null> {
    try {
      const empresas = await apiService.get(`/ejecutiva/empresas?ejecutivaId=${ejecutivaId}`) as Empresa[] | null
      if (!empresas || empresas.length === 0) return null
      return empresas[0]
    } catch (error) {
      console.error('Error fetching empresa asignada:', error)
      return null
    }
  },

  // Obtener empresas registradas por la ejecutiva
  async getEmpresasRegistradas(ejecutivaId: string): Promise<EmpresaRegistrada[]> {
    return apiService.get(`/ejecutiva/empresas/registradas?ejecutivaId=${ejecutivaId}`)
  },

  // Registrar empresa
  async createEmpresa(data: {
    razon_social: string
    ruc: string
    direccion: string
    telefono: string
    correo: string
    ejecutivaId: string
    contraseña: string
    pagina_web?: string
    pais?: string
    departamento?: string
    provincia?: string
    linkedin?: string
    grupo_economico?: string
    rubro?: string
    sub_rubro?: string
    tamanio_empresa?: string
    facturacion_anual?: string
    cantidad_empleados?: string
  }): Promise<Empresa> {
    return apiService.post("/ejecutiva/empresas/registrar", data)
  },

  // Obtener clientes
  async getClientes(ejecutivaId: string): Promise<Cliente[]> {
    return apiService.get(`/ejecutiva/clientes?ejecutivaId=${ejecutivaId}`)
  },

  // Crear cliente
  async createCliente(data: CreateClienteData): Promise<Cliente> {
    return apiService.post("/ejecutiva/clientes", data)
  },

  // Crear trazabilidad
  async createTrazabilidad(data: {
    id_ejecutiva: string
    id_empresa_prov: string
    id_cliente_final: string
    id_contacto: string
    tipo_contacto: string
    fecha_contacto: Date
    resultado_contacto: string
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
  },

  // Obtener pipeline de ventas
  async getPipeline(ejecutivaId: string, limit: number = 10): Promise<{
    length: any;
    oportunidades: PipelineOportunidad[]
    agrupado_por_etapa: Record<string, PipelineOportunidad[]>
    metricas: {
      total_oportunidades: number
      total_monto_pipeline: number
      promedio_probabilidad: number
    }
  }> {
    return apiService.get(`/ejecutiva/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`)
  },

  // Obtener actividades recientes
  async getActividadesRecientes(ejecutivaId: string, limit: number = 10): Promise<ActividadReciente[]> {
    return apiService.get(`/ejecutiva/actividades?ejecutivaId=${ejecutivaId}&limit=${limit}`)
  },

  // Obtener KPIs semanales
  async getKPIsSemanales(ejecutivaId: string): Promise<{
    actividades_semana: number
    nuevas_oportunidades: number
    reuniones_agendadas: number
    inicio_semana: string
  }> {
    console.log('📊 getKPIsSemanales called for ejecutiva:', ejecutivaId)
    return apiService.get(`/ejecutiva/kpis/semanales?ejecutivaId=${ejecutivaId}`)
  },

  // Obtener contactos
  async getContactosCliente(clienteId: string, ejecutivaId: string): Promise<PersonaContacto[]> {
    return apiService.get(`/ejecutiva/contactos?clienteId=${clienteId}&ejecutivaId=${ejecutivaId}`)
  },

  // Crear contacto
  async createPersonaContacto(data: CreateContactoData): Promise<PersonaContacto> {
    return apiService.post("/ejecutiva/contactos", data)
  },

  // Actualizar etapa de oportunidad
  // Actualizar etapa (desde traceability-service)
  // Actualizar etapa de oportunidad
  async updateEtapaOportunidad(data: {
    trazabilidadId: string
    nuevaEtapa: string
    ejecutivaId: string
  }) {
    console.log('🔄 updateEtapaOportunidad called with data:', data)
    return apiService.put("/ejecutiva/trazabilidad/etapa", data)
  }
}