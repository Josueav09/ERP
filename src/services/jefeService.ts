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
  async getClientes(): Promise<ClienteFinal[]> {
    const data = await apiService.get('/jefe/clientes');
    console.log('📥 [jefeService] Clientes del backend:', data);
    return data as ClienteFinal[];
  },

 async createCliente(data: any): Promise<any> {
    console.log('📤 [jefeService] Enviando cliente:', data);
    return apiService.post('/jefe/clientes', data);
  },

  async updateCliente(id: number, data: any): Promise<any> {
    console.log('📤 [jefeService] Actualizando cliente:', data);
    return apiService.put(`/jefe/clientes/${id}`, data);
  },


  async deleteCliente(id: number): Promise<void> {
    return apiService.delete(`/jefe/clientes/${id}`);
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
    const data = await apiService.get('/jefe/ejecutivas/disponibles');
    console.log('📥 [jefeService] Ejecutivas disponibles del backend:', data);
    const ejecutivasMapeadas = (data as any[]).map((ejecutiva: any) => 
      this.mapEjecutivaFromDB(ejecutiva)
    );
    console.log('📤 [jefeService] Ejecutivas disponibles mapeadas:', ejecutivasMapeadas);
    return ejecutivasMapeadas;
  },

  async getEjecutivaDetalle(id: number): Promise<any> {
    const data = await apiService.get(`/jefe/ejecutivas/${id}`);
    console.log('📥 [jefeService] Detalle CRUDO de ejecutiva:', data);
    const detalleMapeado = this.mapEjecutivaDetalleFromDB(data);
    console.log('📤 [jefeService] Detalle mapeado:', detalleMapeado);
    return detalleMapeado;
  },

  async createEjecutiva(data: any): Promise<any> {
    const idJefe = 1; // ✅ TEMPORAL - Reemplaza con el ID del jefe actual
    const dbData = {
      dni: data.dni,
      nombre_completo: `${data.nombre} ${data.apellido}`.trim(),
      correo: data.email,
      contraseña: data.password,
      telefono: data.telefono || null,
      estado_ejecutiva: 'Activo',
      id_jefe: idJefe
    };

    console.log('📤 [jefeService] Enviando datos de ejecutiva al backend:', dbData);
    return apiService.post('/jefe/ejecutivas', dbData);
  },

  async updateEjecutiva(id: number, data: any): Promise<any> {
    const dbData = {
      nombre_completo: `${data.nombre} ${data.apellido}`.trim(),
      correo: data.email,
      telefono: data.telefono,
      estado_ejecutiva: data.activo ? 'Activo' : 'Inactivo'
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

  async toggleEmpresaEstado(id: number, activo: boolean): Promise<any> {
    return apiService.patch(`/jefe/empresas/${id}/estado`, { activo });
  },

  // ✅ CORREGIDO: Mapear ejecutivas de empresa
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
    // ✅ POST /empresas/:empresaId/ejecutivas/:ejecutivaId
    return apiService.post(`/jefe/empresas/${empresaId}/ejecutivas/${ejecutivaId}`);
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
  async getTrazabilidadKPIs(filters?: {
    ejecutivaId?: number;
    empresaId?: number;
    clienteId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) params.append('ejecutivaId', filters.ejecutivaId.toString());
    if (filters?.empresaId) params.append('empresaId', filters.empresaId.toString());
    if (filters?.clienteId) params.append('clienteId', filters.clienteId.toString());
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    return apiService.get(`/jefe/trazabilidad/kpis?${params.toString()}`);
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
    // Si viene separado (nombre + apellido)
    const nombre = dbEjecutiva.nombre || (dbEjecutiva.nombre_completo ? dbEjecutiva.nombre_completo.split(' ')[0] : '');
    const apellido = dbEjecutiva.apellido || (dbEjecutiva.nombre_completo ? dbEjecutiva.nombre_completo.split(' ').slice(1).join(' ') : '');

    return {
      id_usuario: dbEjecutiva.id_usuario || dbEjecutiva.id_ejecutiva,
      nombre: nombre,
      apellido: apellido,
      email: dbEjecutiva.email || dbEjecutiva.correo,
      telefono: dbEjecutiva.telefono,
      rol: 'ejecutiva',
      activo: dbEjecutiva.estado_ejecutiva ? dbEjecutiva.estado_ejecutiva === 'Activo' : true,
      total_empresas: dbEjecutiva.empresa_asignada && dbEjecutiva.empresa_asignada !== 'Sin asignar' ? 1 : 0,
      total_clientes: dbEjecutiva.total_clientes || 0,
      total_actividades: dbEjecutiva.total_actividades || 0,
      estado_ejecutiva: dbEjecutiva.estado_ejecutiva || 'Activo',
      nombre_completo: dbEjecutiva.nombre_completo || `${nombre} ${apellido}`.trim(),
      correo: dbEjecutiva.email || dbEjecutiva.correo
    };
  },


  mapEjecutivaDetalleFromDB(dbDetalle: any): any {
    return {
      ejecutiva: {
        id_usuario: dbDetalle.ejecutiva?.id_ejecutiva || dbDetalle.ejecutiva?.id_usuario,
        nombre: dbDetalle.ejecutiva?.nombre || dbDetalle.ejecutiva?.nombre_completo,
        apellido: dbDetalle.ejecutiva?.apellido || '',
        email: dbDetalle.ejecutiva?.correo || dbDetalle.ejecutiva?.email,
        telefono: dbDetalle.ejecutiva?.telefono,
        activo: dbDetalle.ejecutiva?.estado_ejecutiva === 'Activo' || dbDetalle.ejecutiva?.activo
      },
      empresas: (dbDetalle.empresas || []).map((empresa: any) => ({
        id_empresa: empresa.id_empresa_prov || empresa.id_empresa,
        nombre_empresa: empresa.razon_social || empresa.nombre_empresa,
        rut: empresa.ruc || empresa.rut,
        fecha_asignacion: empresa.fecha_asignacion,
        asignacion_activa: empresa.asignacion_activa !== false
      })),
      clientes: (dbDetalle.clientes || []).map((cliente: any) => ({
        id_cliente: cliente.id_cliente_final || cliente.id_cliente,
        nombre_cliente: cliente.razon_social || cliente.nombre_cliente,
        rut_cliente: cliente.ruc || cliente.rut_cliente,
        email: cliente.correo || cliente.email,
        telefono: cliente.telefono,
        estado: cliente.estado || 'activo',
        nombre_empresa: cliente.nombre_empresa,
        fecha_registro: cliente.fecha_creacion || cliente.fecha_registro
      }))
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