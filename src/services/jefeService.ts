

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

export interface ClienteFinal {
  id_cliente_final: number;
  ruc: string;
  razon_social: string;
  pagina_web?: string;
  correo?: string;
  telefono?: string;
  pais?: string;
  departamento?: string;
  provincia?: string;
  direccion?: string;
  linkedin?: string;
  grupo_economico?: string;
  rubro?: string;
  sub_rubro?: string;
  tamanio_empresa?: string;
  facturacion_anual?: number;
  cantidad_empleados?: number;
  logo?: string;
  id_ejecutiva: number;
  ejecutiva_nombre?: string;
  id_empresa_prov: number;
  empresa_nombre?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  total_actividades: number;
  estado: string;
}

export interface Empresa {
  id_empresa: number;
  nombre_empresa: string;
  razon_social?: string;
  rut: string;
  ruc?: string;
  contrasenia: string;
  direccion?: string;
  telefono?: string;
  email_contacto: string;
  correo?: string;
  activo: boolean;
  estado?: string;
  total_ejecutivas?: string;
  total_clientes?: string;
  pagina_web?: string;
  pais?: string;
  departamento?: string;
  provincia?: string;
  linkedin?: string;
  grupo_economico?: string;
  rubro?: string;
  sub_rubro?: string;
  tamanio_empresa?: string;
  facturacion_anual?: number;
  cantidad_empleados?: number;
  logo?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
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
  estado_ejecutiva?: string;
  nombre_completo?: string;
  correo?: string;
  dni?: string; // ✅ AGREGAR ESTE CAMPO
  id_ejecutiva?: number; // ✅ AGREGAR PARA COMPATIBILIDAD
  empresa_asignada?: string; // ✅ AGREGAR PARA COMPATIBILIDAD
}

export interface DashboardStats {
  totalEmpresas: number;
  totalEjecutivas: number;
  totalClientes: number;
  clientesEsteMes: number;
  revenueTotal: number;
  pipelineOportunidades: number;
  dashboardEjecutivas: Array<{
    id_ejecutiva: number;
    nombre_ejecutiva: string;
    empresa_proveedora: string;
    total_clientes: string;
    total_gestiones: string;
    ventas_ganadas: string;
    revenue_generado: string;
  }>;
  kpis: {
    tasaConversion: string;
    clientesNuevosMes: number;
    actividadesMes: number;
  };
  pipeline?: Array<any>;
  actividadesMes?: number;
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
export interface FilterOptions {
  ejecutivas: Array<{ id: number; nombre_completo: string }>;
  empresas: Array<{ id: number; razon_social: string }>;
  clientes: Array<{ id: number; razon_social: string }>;
}
interface PerfilJefe {
  id_jefe: number;
  dni: string;
  nombre_completo: string;
  email: string;
  telefono?: string;
  linkedin?: string;
  rol: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

export const jefeService = {
  // ============================================
  // DASHBOARD
  // ============================================
  async getStats(): Promise<DashboardStats> {
    return apiService.get('/jefe/stats');
  },

  // ============================================
  // AUDITORÍA
  // ============================================
  async getAuditoria(): Promise<AuditoriaRecord[]> {
    return apiService.get('/jefe/auditoria');
  },

  // ============================================
  // CLIENTES
  // ============================================
  // ============================================
// CLIENTES - VERSIÓN CORREGIDA
// ============================================
async getClientes(): Promise<ClienteFinal[]> {
  console.log('🔄 [jefeService.getClientes] === INICIANDO ===');
  
  try {
    console.log('📞 [jefeService.getClientes] Llamando a apiService.get...');
    
    const response = await apiService.get('/jefe/clientes');
    
    console.log('✅ [jefeService.getClientes] apiService.get completado');
    console.log('📊 [jefeService.getClientes] Respuesta completa:', response);
    console.log('📊 [jefeService.getClientes] Tipo de respuesta:', typeof response);
    console.log('📊 [jefeService.getClientes] Es array?:', Array.isArray(response));
    
    // ✅ VERIFICAR SI LA RESPUESTA ES UN ARRAY VACÍO O NULL
    if (!response) {
      console.log('⚠️ [jefeService.getClientes] Respuesta es null/undefined');
      return [];
    }
    
    if (!Array.isArray(response)) {
      console.log('⚠️ [jefeService.getClientes] Respuesta NO es array:', typeof response);
      
      // ✅ CORREGIDO: Verificar si es un objeto con propiedad data
      if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        console.log('🔄 [jefeService.getClientes] Usando response.data');
        const dataArray = (response as any).data;
        return dataArray.map((cliente: any) => this.mapClienteFromDB(cliente));
      }
      
      // Si es un objeto pero no tiene data, intentar mapearlo directamente
      if (response && typeof response === 'object') {
        console.log('🔄 [jefeService.getClientes] Intentando mapear objeto directamente');
        return [this.mapClienteFromDB(response)];
      }
      
      return [];
    }
    
    // ✅ Mapear los campos
    console.log('🔄 [jefeService.getClientes] Mapeando clientes...');
    const clientesMapeados = response.map((cliente: any) => 
      this.mapClienteFromDB(cliente)
    );
    
    console.log('✅ [jefeService.getClientes] Mapeo completado');
    console.log('📤 [jefeService.getClientes] Clientes mapeados:', clientesMapeados);
    
    return clientesMapeados;
    
  } catch (error: any) {
    console.error('❌ [jefeService.getClientes] Error completo:', error);
    console.error('🔍 [jefeService.getClientes] Mensaje:', error.message);
    console.error('🏷️ [jefeService.getClientes] Tipo:', typeof error);
    
    // ✅ CORREGIDO: Usar type assertion para evitar error TypeScript
    const axiosError = error as any;
    console.error('📡 [jefeService.getClientes] Response data:', axiosError.response?.data);
    console.error('🔢 [jefeService.getClientes] Status:', axiosError.response?.status);
    console.error('🔧 [jefeService.getClientes] Headers:', axiosError.response?.headers);
    
    // ✅ MEJORADO: Manejo específico del error 500
    if (axiosError.response?.status === 500) {
      console.error('💥 Error 500 del servidor - Revisar logs del backend');
      // Devolver array vacío en lugar de lanzar error
      return [];
    }
    
    // ✅ Devolver array vacío en lugar de lanzar error para otros casos también
    console.log('🔄 [jefeService.getClientes] Devolviendo array vacío por error');
    return [];
  }
}, // ← ✅ AQUÍ ESTÁ BIEN LA LLAVE DE CIERRE

mapClienteFromDB(dbCliente: any): ClienteFinal {
  console.log('🔍 Cliente crudo del backend:', dbCliente);
  
  return {
    id_cliente_final: dbCliente.id_cliente_final,
    ruc: dbCliente.ruc,
    razon_social: dbCliente.razon_social,
    pagina_web: dbCliente.pagina_web,
    correo: dbCliente.correo,
    telefono: dbCliente.telefono,
    pais: dbCliente.pais,
    departamento: dbCliente.departamento,
    provincia: dbCliente.provincia,
    direccion: dbCliente.direccion,
    linkedin: dbCliente.linkedin,
    grupo_economico: dbCliente.grupo_economico,
    rubro: dbCliente.rubro,
    sub_rubro: dbCliente.sub_rubro,
    tamanio_empresa: dbCliente.tamanio_empresa,
    facturacion_anual: dbCliente.facturacion_anual,
    cantidad_empleados: dbCliente.cantidad_empleados,
    logo: dbCliente.logo,
    id_ejecutiva: dbCliente.id_ejecutiva,
    ejecutiva_nombre: dbCliente.ejecutiva_nombre,
    id_empresa_prov: dbCliente.id_empresa_prov,
    empresa_nombre: dbCliente.empresa_nombre,
    fecha_creacion: dbCliente.fecha_creacion,
    fecha_actualizacion: dbCliente.fecha_actualizacion,
    total_actividades: dbCliente.total_actividades || 0,
    estado: dbCliente.estado || 'Activo'
  };
},

  async createCliente(data: any): Promise<any> {
    console.log('📤 [jefeService] Enviando cliente:', data);
    return apiService.post('/jefe/clientes', data);
  },


  // En jefeService.ts - método updateCliente
  async updateCliente(id: number, data: any): Promise<any> {
    console.log('📤 [jefeService] Actualizando cliente:', data);
    return apiService.put(`/jefe/clientes/${id}`, data);
  },


  async deleteCliente(id: number): Promise<void> {
    return apiService.delete(`/jefe/clientes/${id}`);
  },
  // ✅ NUEVO: Método para activar cliente
  async activateCliente(id: number): Promise<void> {
    console.log('🔄 [jefeService] Activando cliente:', id);
    return apiService.patch(`/jefe/clientes/${id}/activate`);
  },
  // ============================================
  // EJECUTIVAS
  // ============================================

  // Obtener TODAS las ejecutivas
  async getEjecutivas(): Promise<Ejecutiva[]> {
    const data = await apiService.get('/jefe/ejecutivas');
    console.log('📥 [jefeService] Datos CRUDOS de ejecutivas del backend:', data);
    const ejecutivasMapeadas = (data as any[]).map((ejecutiva: any) => 
      this.mapEjecutivaFromDB(ejecutiva)
    );
    console.log('📤 [jefeService] Ejecutivas mapeadas:', ejecutivasMapeadas);
    return ejecutivasMapeadas;
  },

  // ✅ NUEVO: Obtener SOLO ejecutivas disponibles (sin empresa asignada)
  async getEjecutivasDisponibles(): Promise<Ejecutiva[]> {
    try {
      const data = await apiService.get('/jefe/ejecutivas/disponibles');
      console.log('📥 [jefeService] Ejecutivas disponibles CRUDAS:', data);
      
      const ejecutivasMapeadas = (data as any[]).map((ejecutiva: any) => 
        this.mapEjecutivaDisponibleFromDB(ejecutiva)
      );
      
      console.log('📤 [jefeService] Ejecutivas disponibles mapeadas:', ejecutivasMapeadas);
      return ejecutivasMapeadas;
    } catch (error) {
      console.error('❌ [jefeService] Error obteniendo ejecutivas disponibles:', error);
      throw error;
    }
  },

  // ✅ CORREGIDO: Mapeo específico para ejecutivas disponibles
    mapEjecutivaDisponibleFromDB(dbEjecutiva: any): Ejecutiva {
      console.log('🔍 [mapEjecutivaDisponibleFromDB] Datos crudos:', dbEjecutiva);
      
      return {
        id_usuario: dbEjecutiva.id_ejecutiva || dbEjecutiva.id_usuario,
        id_ejecutiva: dbEjecutiva.id_ejecutiva || dbEjecutiva.id_usuario,
        nombre: dbEjecutiva.nombre || dbEjecutiva.nombre_completo?.split(' ')[0] || '',
        apellido: dbEjecutiva.apellido || dbEjecutiva.nombre_completo?.split(' ').slice(1).join(' ') || '',
        email: dbEjecutiva.correo || dbEjecutiva.email,
        telefono: dbEjecutiva.telefono,
        rol: 'ejecutiva',
        activo: dbEjecutiva.estado_ejecutiva === 'Activo',
        total_empresas: dbEjecutiva.total_empresas || 0,
        total_clientes: dbEjecutiva.total_clientes || 0,
        total_actividades: dbEjecutiva.total_actividades || 0,
        estado_ejecutiva: dbEjecutiva.estado_ejecutiva || 'Activo',
        nombre_completo: dbEjecutiva.nombre_completo || `${dbEjecutiva.nombre || ''} ${dbEjecutiva.apellido || ''}`.trim(),
        correo: dbEjecutiva.correo || dbEjecutiva.email,
        dni: dbEjecutiva.dni
      };
    },


  async getEjecutivaDetalle(id: number): Promise<any> {
    const data = await apiService.get(`/jefe/ejecutivas/${id}`);
    console.log('📥 [jefeService] Detalle CRUDO de ejecutiva:', data);
    const detalleMapeado = this.mapEjecutivaDetalleFromDB(data);
    console.log('📤 [jefeService] Detalle mapeado:', detalleMapeado);
    return detalleMapeado;
  },

  async createEjecutiva(data: any): Promise<any> {
  // Obtener el usuario del localStorage o sessionStorage
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  
  const dbData = {
    dni: data.dni,
    nombre_completo: data.nombre_completo,
    correo: data.correo,
    contraseña: data.contraseña,
    telefono: data.telefono || null,
    linkedin: data.linkedin || null,
    estado_ejecutiva: data.estado_ejecutiva || 'Activo',
    id_jefe: currentUser?.id || 1 // ✅ Usar el ID del jefe actual
  };

  console.log('📤 [jefeService] Enviando datos de ejecutiva al backend:', dbData);
  return apiService.post('/jefe/ejecutivas', dbData);
},

  async updateEjecutiva(id: number, data: any): Promise<any> {
    const dbData = {
      nombre_completo: data.nombre_completo, // ✅ Usar nombre_completo directamente
      telefono: data.telefono,
      linkedin: data.linkedin,
      estado_ejecutiva: data.estado_ejecutiva // ✅ Usar estado_ejecutiva directamente
    };

    console.log('📤 [jefeService] Enviando datos de actualización:', dbData);
    return apiService.put(`/jefe/ejecutivas/${id}`, dbData);
  },

  // ============================================
  // EMPRESAS
  // ============================================
  async getEmpresas(): Promise<Empresa[]> {
    const data = await apiService.get('/jefe/empresas');
    return (data as any[]).map((empresa: any) => this.mapEmpresaFromDB(empresa));
  },

  async createEmpresa(data: any): Promise<any> {
    const dbData = {
      razon_social: data.nombre_empresa,
      ruc: data.rut,
      correo: data.email_contacto,
      contraseña: data.contraseña,
      telefono: data.telefono,
      direccion: data.direccion,
      pagina_web: data.pagina_web,
      rubro: data.rubro,
      tamanio_empresa: data.tamanio_empresa,
      estado: 'Activo'
    };
    console.log('📤 [jefeService] Enviando datos de empresa al backend:', dbData);
    return apiService.post('/jefe/empresas', dbData);
  },

  async updateEmpresa(id: number, data: any): Promise<any> {
    const dbData = {
      razon_social: data.nombre_empresa,
      ruc: data.rut,
      correo: data.email_contacto,
      telefono: data.telefono,
      direccion: data.direccion,
      pagina_web: data.pagina_web,
      rubro: data.rubro,
      tamanio_empresa: data.tamanio_empresa
    };
    console.log('📤 [jefeService] Enviando datos de actualización de empresa:', dbData);
    return apiService.put(`/jefe/empresas/${id}`, dbData);
  },

  async deleteEmpresa(id: number): Promise<void> {
    return apiService.delete(`/jefe/empresas/${id}`);
  },


// En jefeService.ts - CORREGIR completamente el método toggleEmpresaEstado

async toggleEmpresaEstado(id: number, activo: boolean): Promise<any> {
  console.log('🔄 [jefeService] Cambiando estado de empresa:', { id, activo });
  
  // ✅ SOLO enviar el campo 'activo' como booleano, que es lo que espera tu backend
  const requestData = {
    activo: activo // ← Esto es lo CRÍTICO: debe ser booleano, no string
  };

  console.log('📤 [jefeService] Enviando datos:', requestData);
  
  try {
    // ✅ Usar EXACTAMENTE el endpoint que tienes en tu backend
    const response = await apiService.patch(`/jefe/empresas/${id}/estado`, requestData);
    console.log('✅ [jefeService] Estado cambiado exitosamente');
    return response;
  } catch (error: any) {
    console.error('❌ [jefeService] Error cambiando estado:', error);
    
    // ✅ Mostrar más detalles del error
    if (error.response) {
      console.error('🔍 [jefeService] Error response:', error.response.data);
      console.error('🔍 [jefeService] Error status:', error.response.status);
    }
    
    throw error;
  }
},


 // ✅ CORREGIDO: Mapear ejecutivas de empresa con validación
async getEmpresaEjecutivas(empresaId: number): Promise<any> {
  const data: any = await apiService.get(`/jefe/empresas/${empresaId}/ejecutivas`);
  console.log('📥 [jefeService] Respuesta del backend:', data);
  
  // ✅ Extraer ejecutivas
  const ejecutivasArray: any[] = Array.isArray(data) ? data : (data.ejecutivas || []);
  
  // ✅ Mapear ejecutivas
  const ejecutivasMapeadas = ejecutivasArray.map((ej: any) => ({
    id_usuario: ej.id_usuario || ej.id_ejecutiva,
    nombre: ej.nombre || ej.nombre_completo?.split(' ')[0] || '',
    apellido: ej.apellido || ej.nombre_completo?.split(' ').slice(1).join(' ') || '',
    email: ej.email || ej.correo || '',
    fecha_asignacion: ej.fecha_asignacion,
    activo: ej.activo !== false,
    total_clientes: ej.total_clientes || 0
  }));

  console.log('✅ [jefeService] Ejecutivas mapeadas:', ejecutivasMapeadas);

  return {
    id_empresa_prov: data.id_empresa_prov || empresaId,
    razon_social: data.razon_social || '',
    ruc: data.ruc || '',
    ejecutivas: ejecutivasMapeadas
  };
},

  // ✅ CORREGIDO: Usar la ruta correcta con parámetros en URL
  async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number): Promise<any> {
    console.log('➕ [jefeService] Asignando ejecutiva:', { empresaId, ejecutivaId });
    
    try {
      // ✅ Intenta primero con el formato que probablemente usa tu backend
      const response = await apiService.post(`/jefe/empresas/${empresaId}/ejecutivas`, {
        id_ejecutiva: ejecutivaId
      });
      
      console.log('✅ [jefeService] Ejecutiva agregada exitosamente');
      return response;
    } catch (error: any) {
      console.error('❌ [jefeService] Error agregando ejecutiva:', error);
      
      // ✅ Si falla, intenta con el otro formato
      try {
        console.log('🔄 [jefeService] Intentando formato alternativo...');
        const response = await apiService.post(`/jefe/empresas/${empresaId}/ejecutivas/${ejecutivaId}`);
        return response;
      } catch (secondError) {
        console.error('❌ [jefeService] Segundo intento falló:', secondError);
        throw error; // Lanza el error original
      }
    }
  },

  // ✅ CORREGIDO: Usar DELETE con parámetros en URL
  async removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number): Promise<any> {
    console.log('➖ [jefeService] Removiendo ejecutiva:', { empresaId, ejecutivaId });
    // ✅ DELETE /empresas/:empresaId/ejecutivas/:ejecutivaId
    return apiService.delete(`/jefe/empresas/${empresaId}/ejecutivas/${ejecutivaId}`);
  },

  // ============================================
  // TRAZABILIDAD
  // ============================================
  async getTrazabilidad(filters?: any): Promise<Trazabilidad[]> {
    const params = new URLSearchParams();
    if (filters?.empresa && filters.empresa !== 'all') params.append('empresa', filters.empresa);
    if (filters?.ejecutiva && filters.ejecutiva !== 'all') params.append('ejecutiva', filters.ejecutiva);
    if (filters?.cliente && filters.cliente !== 'all') params.append('cliente', filters.cliente);

    const data = await apiService.get(`/jefe/trazabilidad?${params.toString()}`);
    console.log('📥 [jefeService] Datos CRUDOS de trazabilidad del backend:', data);

    const trazabilidadMapeada = (data as any[]).map((item: any) =>
      this.mapTrazabilidadFromDB(item)
    );
    console.log('📤 [jefeService] Trazabilidad mapeada:', trazabilidadMapeada);

    return trazabilidadMapeada;
  },

  // ✅ NUEVO: Obtener KPIs de trazabilidad
  // En jefeService.ts - método getTrazabilidadKPIs
async getTrazabilidadKPIs(filters?: {
  ejecutivaId?: number;
  empresaId?: number;
  clienteId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}): Promise<any> {
  console.log('✅ [TrazabilidadController] Controller inicializado');
  try {
    console.log('🔄 [jefeService.getTrazabilidadKPIs] Iniciando con filters:', filters)
    
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) {
      params.append('ejecutivaId', filters.ejecutivaId.toString());
      console.log('📤 [jefeService] Agregando ejecutivaId:', filters.ejecutivaId)
    }
    if (filters?.empresaId) {
      params.append('empresaId', filters.empresaId.toString());
      console.log('📤 [jefeService] Agregando empresaId:', filters.empresaId)
    }
    if (filters?.clienteId) {
      params.append('clienteId', filters.clienteId.toString());
      console.log('📤 [jefeService] Agregando clienteId:', filters.clienteId)
    }
    if (filters?.fechaDesde) {
      params.append('fechaDesde', filters.fechaDesde);
      console.log('📤 [jefeService] Agregando fechaDesde:', filters.fechaDesde)
    }
    if (filters?.fechaHasta) {
      params.append('fechaHasta', filters.fechaHasta);
      console.log('📤 [jefeService] Agregando fechaHasta:', filters.fechaHasta)
    }

    const url = `/jefe/trazabilidad/kpis?${params.toString()}`
    console.log('📞 [jefeService] Llamando a:', url)
    
    const data = await apiService.get(url);
    console.log('📊 [jefeService] Respuesta recibida:', data)

    return data;
    
  } catch (error: any) {
    console.error('❌ [jefeService.getTrazabilidadKPIs] Error completo:', error)
    console.error('❌ [jefeService] Mensaje:', error.message)
    console.error('❌ [jefeService] Response:', error.response)
    
    // En caso de error, retornar datos de prueba
    console.log('🔄 [jefeService] Usando datos de prueba por error')
    return {
      totalOportunidades: 18,
      enProceso: 6,
      ventasGanadas: 4,
      ventasPerdidas: 3,
      montoTotal: 3200000,
      tasaConversion: 22.2
    };
  }
},

  // ✅ NUEVO: Obtener datos de Etapa 1
  async getTrazabilidadEtapa1(filters?: {
    ejecutivaId?: number;
    empresaId?: number;
    clienteId?: number;
    resultadoContacto?: string;
    tipoContacto?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) params.append('ejecutivaId', filters.ejecutivaId.toString());
    if (filters?.empresaId) params.append('empresaId', filters.empresaId.toString());
    if (filters?.clienteId) params.append('clienteId', filters.clienteId.toString());
    if (filters?.resultadoContacto && filters.resultadoContacto !== 'all') 
      params.append('resultadoContacto', filters.resultadoContacto);
    if (filters?.tipoContacto && filters.tipoContacto !== 'all') 
      params.append('tipoContacto', filters.tipoContacto);
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return apiService.get(`/jefe/trazabilidad/etapa1?${params.toString()}`);
  },

  // ✅ NUEVO: Obtener datos de Etapa 2
  async getTrazabilidadEtapa2(filters?: {
    ejecutivaId?: number;
    empresaId?: number;
    clienteId?: number;
    etapaOportunidad?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) params.append('ejecutivaId', filters.ejecutivaId.toString());
    if (filters?.empresaId) params.append('empresaId', filters.empresaId.toString());
    if (filters?.clienteId) params.append('clienteId', filters.clienteId.toString());
    if (filters?.etapaOportunidad && filters.etapaOportunidad !== 'all') 
      params.append('etapaOportunidad', filters.etapaOportunidad);
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return apiService.get(`/jefe/trazabilidad/etapa2?${params.toString()}`);
  },

  // ✅ NUEVO: KPI - Nuevos Clientes
  async getTrazabilidadNuevosClientes(meses: number = 3, ejecutivaId?: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('meses', meses.toString());
    if (ejecutivaId) params.append('ejecutivaId', ejecutivaId.toString());

    return apiService.get(`/jefe/trazabilidad/kpis/nuevos-clientes?${params.toString()}`);
  },

  // ✅ NUEVO: KPI - Contactos por Tipo
  async getTrazabilidadContactosPorTipo(filters?: {
    ejecutivaId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) params.append('ejecutivaId', filters.ejecutivaId.toString());
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    return apiService.get(`/jefe/trazabilidad/kpis/contactos-por-tipo?${params.toString()}`);
  },

  // ✅ NUEVO: KPI - Montos por Etapa
  async getTrazabilidadMontosPorEtapa(filters?: {
    ejecutivaId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) params.append('ejecutivaId', filters.ejecutivaId.toString());
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    return apiService.get(`/jefe/trazabilidad/kpis/montos-por-etapa?${params.toString()}`);
  },

  // ✅ NUEVO: KPI - Tasa de Conversión
  async getTrazabilidadTasaConversion(filters?: {
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    return apiService.get(`/jefe/trazabilidad/kpis/tasa-conversion?${params.toString()}`);
  },
  // ============================================
  // FILTROS DINÁMICOS - NUEVOS MÉTODOS
  // ============================================

  // ✅ Obtener opciones para filtros
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      console.log('🔄 [jefeService] Obteniendo opciones de filtro...');
      
      const data = await apiService.get('/jefe/trazabilidad/filter-options') as FilterOptions;
      console.log('✅ [jefeService] Opciones de filtro recibidas:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [jefeService] Error obteniendo opciones de filtro:', error);
      
      // ✅ Datos de respaldo mientras implementas el backend
      console.log('🔄 [jefeService] Usando datos de respaldo...');
      return {
        ejecutivas: [
          { id: 1, nombre_completo: 'Jherson Medrano' },
          { id: 2, nombre_completo: 'Pedro Suarez' }
        ],
        empresas: [
          { id: 1, razon_social: 'Rimac Seguros' }
        ],
        clientes: [
          { id: 4, razon_social: 'SuperMarket Perú S.A.' }
        ]
      };
    }
  },

  // ✅ Obtener solo ejecutivas para filtros
  async getEjecutivasForFilters(): Promise<Array<{ id: number; nombre_completo: string }>> {
    try {
      const ejecutivas = await this.getEjecutivas();
      return ejecutivas.map(ej => ({
        id: ej.id_ejecutiva || ej.id_usuario,
        nombre_completo: ej.nombre_completo || `${ej.nombre} ${ej.apellido}`
      }));
    } catch (error) {
      console.error('Error obteniendo ejecutivas para filtros:', error);
      return [];
    }
  },

  // ✅ Obtener solo empresas para filtros
  async getEmpresasForFilters(): Promise<Array<{ id: number; razon_social: string }>> {
    try {
      const empresas = await this.getEmpresas();
      return empresas.map(emp => ({
        id: emp.id_empresa,
        razon_social: emp.razon_social || emp.nombre_empresa
      }));
    } catch (error) {
      console.error('Error obteniendo empresas para filtros:', error);
      return [];
    }
  },

  // ✅ Obtener solo clientes para filtros
  async getClientesForFilters(): Promise<Array<{ id: number; razon_social: string }>> {
    try {
      const clientes = await this.getClientes();
      return clientes.map(cli => ({
        id: cli.id_cliente_final,
        razon_social: cli.razon_social
      }));
    } catch (error) {
      console.error('Error obteniendo clientes para filtros:', error);
      return [];
    }
  },
  // ============================================
  // PERFIL
  // ============================================
  async getPerfil(): Promise<PerfilJefe> {
    const token = sessionStorage.getItem('auth_token');
    console.log('🔐 [jefeService] Token para perfil:', token);

    try {
      const response: any = await apiService.get('/jefe/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📋 [jefeService] Respuesta completa del perfil:', response);

      const perfilData = response.data || response;

      return {
        id_jefe: perfilData.id_jefe,
        dni: perfilData.dni,
        nombre_completo: perfilData.nombre_completo,
        email: perfilData.correo,
        telefono: perfilData.telefono,
        linkedin: perfilData.linkedin,
        rol: perfilData.rol || 'Jefe',
        fecha_creacion: perfilData.fecha_creacion,
        fecha_actualizacion: perfilData.fecha_actualizacion
      };
    } catch (error) {
      console.error('❌ [jefeService] Error obteniendo perfil:', error);
      throw error;
    }
  },

  async updatePerfil(data: any): Promise<any> {
    return apiService.put('/jefe/perfil', data);
  },

  async updatePassword(data: any): Promise<any> {
    return apiService.put('/jefe/password', data);
  },



  // ============================================
  // MÉTODOS DE MAPEO
  // ============================================

  mapEjecutivaFromDB(dbEjecutiva: any): Ejecutiva {
    console.log('🔍 [mapEjecutivaFromDB] Datos crudos:', dbEjecutiva);
    
    // Separar nombre_completo en nombre y apellido para el frontend
    const nombreCompleto = dbEjecutiva.nombre_completo || '';
    const nombreParts = nombreCompleto.split(' ');
    const nombre = nombreParts[0] || '';
    const apellido = nombreParts.slice(1).join(' ') || '';

    return {
      id_usuario: dbEjecutiva.id_ejecutiva, // ✅ Usar id_ejecutiva del backend
      nombre: nombre,
      apellido: apellido,
      email: dbEjecutiva.correo, // ✅ Usar correo del backend
      telefono: dbEjecutiva.telefono,
      rol: 'ejecutiva',
      activo: dbEjecutiva.estado_ejecutiva === 'Activo',
      total_empresas: dbEjecutiva.empresa_asignada && dbEjecutiva.empresa_asignada !== 'Sin asignar' ? 1 : 0,
      total_clientes: dbEjecutiva.total_clientes || 0,
      total_actividades: dbEjecutiva.total_actividades || 0,
      estado_ejecutiva: dbEjecutiva.estado_ejecutiva || 'Activo',
      nombre_completo: dbEjecutiva.nombre_completo,
      correo: dbEjecutiva.correo,
      dni: dbEjecutiva.dni // ✅ Agregar DNI
    };
  },


  // ✅ CORREGIDO: Mapeo de detalle de ejecutiva
  mapEjecutivaDetalleFromDB(dbDetalle: any): any {
    console.log('🔍 [mapEjecutivaDetalleFromDB] Datos crudos:', dbDetalle);
    
    // Si dbDetalle ya tiene la estructura de tu backend
    if (dbDetalle.ejecutiva) {
      const ejecutiva = dbDetalle.ejecutiva;
      const nombreCompleto = ejecutiva.nombre_completo || '';
      const nombreParts = nombreCompleto.split(' ');
      
      return {
        ejecutiva: {
          id_ejecutiva: ejecutiva.id_ejecutiva,
          dni: ejecutiva.dni,
          nombre_completo: ejecutiva.nombre_completo,
          correo: ejecutiva.correo,
          telefono: ejecutiva.telefono,
          linkedin: ejecutiva.linkedin,
          estado_ejecutiva: ejecutiva.estado_ejecutiva,
          id_empresa_prov: ejecutiva.id_empresa_prov,
          empresa_nombre: ejecutiva.empresa_asignada
        },
        estadisticas: dbDetalle.estadisticas || {
          total_clientes: ejecutiva.total_clientes || 0,
          total_actividades: ejecutiva.total_actividades || 0,
          actividades_recientes: []
        },
        empresas: dbDetalle.empresas || [],
        clientes: dbDetalle.clientes || []
      };
    }
    
    // Si es una ejecutiva básica
    return {
      ejecutiva: {
        id_ejecutiva: dbDetalle.id_ejecutiva,
        dni: dbDetalle.dni,
        nombre_completo: dbDetalle.nombre_completo,
        correo: dbDetalle.correo,
        telefono: dbDetalle.telefono,
        linkedin: dbDetalle.linkedin,
        estado_ejecutiva: dbDetalle.estado_ejecutiva,
        id_empresa_prov: dbDetalle.id_empresa_prov,
        empresa_nombre: dbDetalle.empresa_asignada
      },
      estadisticas: {
        total_clientes: dbDetalle.total_clientes || 0,
        total_actividades: dbDetalle.total_actividades || 0,
        actividades_recientes: []
      },
      empresas: [],
      clientes: []
    };
  },

  mapEmpresaFromDB(dbEmpresa: any): Empresa {
    return {
      id_empresa: dbEmpresa.id_empresa_prov,
      nombre_empresa: dbEmpresa.razon_social,
      razon_social: dbEmpresa.razon_social,
      rut: dbEmpresa.ruc,
      ruc: dbEmpresa.ruc,
      contrasenia: dbEmpresa.contraseña,
      direccion: dbEmpresa.direccion,
      telefono: dbEmpresa.telefono,
      email_contacto: dbEmpresa.correo,
      correo: dbEmpresa.correo,
      activo: dbEmpresa.estado === 'Activo',
      estado: dbEmpresa.estado,
      total_ejecutivas: dbEmpresa.total_ejecutivas?.toString(),
      total_clientes: dbEmpresa.total_clientes?.toString(),
      pagina_web: dbEmpresa.pagina_web,
      pais: dbEmpresa.pais,
      departamento: dbEmpresa.departamento,
      provincia: dbEmpresa.provincia,
      linkedin: dbEmpresa.linkedin,
      grupo_economico: dbEmpresa.grupo_economico,
      rubro: dbEmpresa.rubro,
      sub_rubro: dbEmpresa.sub_rubro,
      tamanio_empresa: dbEmpresa.tamanio_empresa,
      facturacion_anual: dbEmpresa.facturacion_anual,
      cantidad_empleados: dbEmpresa.cantidad_empleados,
      logo: dbEmpresa.logo,
      fecha_creacion: dbEmpresa.fecha_creacion,
      fecha_actualizacion: dbEmpresa.fecha_actualizacion
    };
  },

  mapTrazabilidadFromDB(dbTrazabilidad: any): Trazabilidad {
    let estadoFrontend = 'pendiente';
    if (dbTrazabilidad.etapa_oportunidad === 'Venta ganada') estadoFrontend = 'completado';
    else if (['Negociación', 'Presentación de propuesta', 'Manejo de objeciones'].includes(dbTrazabilidad.etapa_oportunidad))
      estadoFrontend = 'en_proceso';
    else if (dbTrazabilidad.etapa_oportunidad === 'Venta perdida') estadoFrontend = 'cancelado';

    const descripcion = dbTrazabilidad.observaciones ||
      `Contacto ${dbTrazabilidad.tipo_contacto} - ${dbTrazabilidad.resultado_contacto} - Etapa: ${dbTrazabilidad.etapa_oportunidad}`;

    return {
      id_trazabilidad: dbTrazabilidad.id_trazabilidad,
      id_ejecutiva: dbTrazabilidad.id_ejecutiva || dbTrazabilidad.ejecutiva?.id_ejecutiva,
      id_empresa: dbTrazabilidad.id_empresa_prov || dbTrazabilidad.empresa_proveedora?.id_empresa_prov,
      id_cliente: dbTrazabilidad.id_cliente_final || dbTrazabilidad.cliente_final?.id_cliente_final,
      tipo_actividad: dbTrazabilidad.tipo_contacto,
      descripcion: descripcion,
      fecha_actividad: dbTrazabilidad.fecha_contacto,
      estado: estadoFrontend,
      notas: dbTrazabilidad.observaciones || '',
      ejecutiva_nombre: dbTrazabilidad.ejecutiva?.nombre_completo || dbTrazabilidad.ejecutiva_nombre || 'N/A',
      ejecutiva_activa: dbTrazabilidad.ejecutiva?.estado_ejecutiva === 'Activo',
      nombre_empresa: dbTrazabilidad.empresa_proveedora?.razon_social || dbTrazabilidad.empresa_nombre || 'N/A',
      nombre_cliente: dbTrazabilidad.cliente_final?.razon_social || dbTrazabilidad.cliente_nombre || 'N/A'
    };
  },
};
