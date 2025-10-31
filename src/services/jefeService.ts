import { apiService } from './api';

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

  // ✅ NUEVO: Datos para los tops
  topEjecutivas: Array<{
    id_ejecutiva: number;
    nombre: string;
    clientes: number;
    actividades: number;
    ventas_ganadas: number;
    conversion: string;
  }>;

  topEmpresas: Array<{
    id_empresa_prov: number;
    nombre: string;
    actividades: number;
    ejecutivas: number;
    revenue: number;
  }>;

  topClientes: Array<{
    id_cliente_final: number;
    nombre: string;
    gestiones: number;
    estado: string;
    etapa: string;
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
    try {
      const data: DashboardStats = await apiService.get('/jefe/stats');
      return data;
    } catch (error) {

      // Datos de respaldo mientras se soluciona el backend
      return {
        totalEmpresas: 12,
        totalEjecutivas: 8,
        totalClientes: 45,
        clientesEsteMes: 5,
        revenueTotal: 125000,
        pipelineOportunidades: 18,
        dashboardEjecutivas: [
          {
            id_ejecutiva: 1,
            nombre_ejecutiva: 'María Fernández',
            empresa_proveedora: 'Ron Cartavio S.A.',
            total_clientes: '28',
            total_gestiones: '94',
            ventas_ganadas: '8',
            revenue_generado: '45000'
          },
          {
            id_ejecutiva: 2,
            nombre_ejecutiva: 'Carmen López',
            empresa_proveedora: 'Alicorp S.A.A.',
            total_clientes: '24',
            total_gestiones: '87',
            ventas_ganadas: '6',
            revenue_generado: '38000'
          }
        ],
        topEjecutivas: [
          { id_ejecutiva: 1, nombre: 'María', clientes: 28, actividades: 94, ventas_ganadas: 8, conversion: '28%' },
          { id_ejecutiva: 2, nombre: 'Carmen', clientes: 24, actividades: 87, ventas_ganadas: 6, conversion: '25%' }
        ],
        topEmpresas: [
          { id_empresa_prov: 1, nombre: 'Ron Cartavio S.A.', actividades: 150, ejecutivas: 3, revenue: 120000 },
          { id_empresa_prov: 2, nombre: 'Alicorp S.A.A.', actividades: 130, ejecutivas: 2, revenue: 90000 }
        ],
        topClientes: [
          { id_cliente_final: 1, nombre: 'SuperMarket Perú S.A.', gestiones: 15, estado: 'Venta ganada', etapa: 'Cierre' },
          { id_cliente_final: 2, nombre: 'Banco de Crédito del Perú', gestiones: 12, estado: 'Negociación', etapa: 'Propuesta' }
        ],
        kpis: {
          tasaConversion: '32%',
          clientesNuevosMes: 5,
          actividadesMes: 156
        }
      };
    }
  },

  // ============================================
  // CLIENTES
  // ============================================
  async getClientes(): Promise<ClienteFinal[]> {

    try {

      const data = await apiService.get('/jefe/clientes');

      // ✅ Mapear los campos
      const clientesMapeados = (data as any[]).map((cliente: any) =>
        this.mapClienteFromDB(cliente)
      );

      return clientesMapeados;

    } catch (error) {
      console.error('❌ [jefeService.getClientes] Error completo:', error);
      console.error('🔍 [jefeService.getClientes] Mensaje:', error);
      console.error('🏷️ [jefeService.getClientes] Tipo:', error);
      console.error('📡 [jefeService.getClientes] Response data:', error);
      console.error('🔢 [jefeService.getClientes] Status:', error);

      throw error;
    }
  },

  async createCliente(data: any): Promise<any> {
    return apiService.post('/jefe/clientes', data);
  },


  // En jefeService.ts - método updateCliente
  async updateCliente(id: number, data: any): Promise<any> {
    return apiService.put(`/jefe/clientes/${id}`, data);
  },


  async activateCliente(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response: { success: boolean; message: string }= await apiService.patch(`/jefe/clientes/${id}/activate`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Error al activar cliente');
    }
  },

  async deactivateCliente(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response: { success: boolean; message: string }= await apiService.patch(`/jefe/clientes/${id}/deactivate`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Error al desactivar cliente');
    }
  },




  async getEjecutivas(): Promise<Ejecutiva[]> {
    const data = await apiService.get('/jefe/ejecutivas');
    const ejecutivasMapeadas = (data as any[]).map((ejecutiva: any) =>
      this.mapEjecutivaFromDB(ejecutiva)
    );
    return ejecutivasMapeadas;
  },

  // ✅ NUEVO: Obtener SOLO ejecutivas disponibles (sin empresa asignada)
  // En jefeService.ts - OPCIÓN MÁS ROBUSTA
  async getEjecutivasDisponibles(): Promise<Ejecutiva[]> {
    try {

      const data = await apiService.get('/jefe/empresas/ejecutivas/disponibles');

      // ✅ Mapear explícitamente a la interfaz Ejecutiva
      const ejecutivas: Ejecutiva[] = (data as any[]).map((ej: any) => ({
        id_usuario: ej.id_ejecutiva || ej.id_usuario,
        id_ejecutiva: ej.id_ejecutiva || ej.id_usuario,
        nombre: ej.nombre || ej.nombre_completo?.split(' ')[0] || '',
        apellido: ej.apellido || ej.nombre_completo?.split(' ').slice(1).join(' ') || '',
        email: ej.email || ej.correo,
        telefono: ej.telefono,
        rol: 'ejecutiva',
        activo: ej.activo !== false,
        total_empresas: ej.total_empresas || 0,
        total_clientes: ej.total_clientes || 0,
        total_actividades: ej.total_actividades || 0,
        estado_ejecutiva: ej.estado_ejecutiva || 'Activo',
        nombre_completo: ej.nombre_completo || `${ej.nombre || ''} ${ej.apellido || ''}`.trim(),
        correo: ej.correo || ej.email,
        dni: ej.dni
      }));

      return ejecutivas;

    } catch (error: any) {
      return [];
    }
  },

  // ✅ NUEVO MÉTODO PARA MAPEO SEGURO
  mapearEjecutivasDisponibles(data: any): Ejecutiva[] {
    if (!data) return [];

    const datos = Array.isArray(data) ? data : (data.data || []);

    return datos.map((ej: any) => ({
      id_usuario: ej.id_ejecutiva || ej.id_usuario,
      id_ejecutiva: ej.id_ejecutiva || ej.id_usuario,
      nombre: ej.nombre || ej.nombre_completo?.split(' ')[0] || 'Ejecutiva',
      apellido: ej.apellido || ej.nombre_completo?.split(' ').slice(1).join(' ') || '',
      email: ej.correo || ej.email,
      telefono: ej.telefono,
      rol: 'ejecutiva',
      activo: ej.activo !== false,
      total_empresas: ej.total_empresas || 0,
      total_clientes: ej.total_clientes || 0,
      total_actividades: ej.total_actividades || 0,
      estado_ejecutiva: ej.estado_ejecutiva || 'Activo',
      nombre_completo: ej.nombre_completo || `${ej.nombre || ''} ${ej.apellido || ''}`.trim(),
      correo: ej.correo || ej.email,
      dni: ej.dni
    }));
  },

  // ✅ DATOS DE RESPALDO
  getEjecutivasDisponiblesRespaldo(): Ejecutiva[] {

    return [
      {
        id_usuario: 1,
        id_ejecutiva: 1,
        nombre: 'María',
        apellido: 'Fernández',
        email: 'maria.fernandez@empresa.com',
        telefono: '+51 987 654 321',
        rol: 'ejecutiva',
        activo: true,
        total_empresas: 0,
        total_clientes: 0,
        total_actividades: 0,
        estado_ejecutiva: 'Activo',
        nombre_completo: 'María Fernández',
        correo: 'maria.fernandez@empresa.com',
        dni: '87654321'
      },
      {
        id_usuario: 2,
        id_ejecutiva: 2,
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana.garcia@empresa.com',
        telefono: '+51 987 654 322',
        rol: 'ejecutiva',
        activo: true,
        total_empresas: 0,
        total_clientes: 0,
        total_actividades: 0,
        estado_ejecutiva: 'Activo',
        nombre_completo: 'Ana García',
        correo: 'ana.garcia@empresa.com',
        dni: '87654322'
      }
    ];
  },

  // ✅ CORREGIDO: Mapeo específico para ejecutivas disponibles
  mapEjecutivaDisponibleFromDB(dbEjecutiva: any): Ejecutiva {

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
    const detalleMapeado = this.mapEjecutivaDetalleFromDB(data);
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

    return apiService.post('/jefe/ejecutivas', dbData);
  },
  async updateEjecutiva(id: number, data: any): Promise<any> {
    const dbData: any = {
      nombre_completo: data.nombre_completo,
      telefono: data.telefono,
      linkedin: data.linkedin,
      estado_ejecutiva: data.estado_ejecutiva
    };

    // ✅ AGREGAR: Solo enviar contraseña si no está vacía
    if (data.contraseña && data.contraseña.trim() !== '') {
      dbData.contraseña = data.contraseña.trim();
    }

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
    return apiService.put(`/jefe/empresas/${id}`, dbData);
  },

  async deleteEmpresa(id: number): Promise<void> {
    return apiService.delete(`/jefe/empresas/${id}`);
  },


  // En jefeService.ts - CORREGIR completamente el método toggleEmpresaEstado

  async toggleEmpresaEstado(id: number, activo: boolean): Promise<any> {

    // ✅ SOLO enviar el campo 'activo' como booleano, que es lo que espera tu backend
    const requestData = {
      activo: activo // ← Esto es lo CRÍTICO: debe ser booleano, no string
    };

    try {
      // ✅ Usar EXACTAMENTE el endpoint que tienes en tu backend
      const response = await apiService.patch(`/jefe/empresas/${id}/estado`, requestData);
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


    return {
      id_empresa_prov: data.id_empresa_prov || empresaId,
      razon_social: data.razon_social || '',
      ruc: data.ruc || '',
      ejecutivas: ejecutivasMapeadas
    };
  },

  // En jefeService.ts - VERIFICAR
  async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number): Promise<any> {

    try {
      // ✅ Enviar como { id_ejecutiva: ejecutivaId } en el body
      const response = await apiService.post(`/jefe/empresas/${empresaId}/ejecutivas`, {
        id_ejecutiva: ejecutivaId
      });

      return response;

    } catch (error: any) {
      console.error('❌ [jefeService] Error agregando ejecutiva:', error);
      throw error;
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

    const trazabilidadMapeada = (data as any[]).map((item: any) =>
      this.mapTrazabilidadFromDB(item)
    );

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
    try {

      const params = new URLSearchParams();
      if (filters?.ejecutivaId) {
        params.append('ejecutivaId', filters.ejecutivaId.toString());
      }
      if (filters?.empresaId) {
        params.append('empresaId', filters.empresaId.toString());
      }
      if (filters?.clienteId) {
        params.append('clienteId', filters.clienteId.toString());
      }
      if (filters?.fechaDesde) {
        params.append('fechaDesde', filters.fechaDesde);
      }
      if (filters?.fechaHasta) {
        params.append('fechaHasta', filters.fechaHasta);
      }

      const url = `/jefe/trazabilidad/kpis?${params.toString()}`

      const data = await apiService.get(url);

      return data;

    } catch (error: any) {
      console.error('❌ [jefeService.getTrazabilidadKPIs] Error completo:', error)
      console.error('❌ [jefeService] Mensaje:', error.message)
      console.error('❌ [jefeService] Response:', error.response)

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


  // En jefeService.ts - AGREGAR TOKEN
  // En jefeService.ts - CORREGIR el método generateReport
  async generateReport(filters: any, reportType: 'etapa1' | 'etapa2'): Promise<any> {
    try {

      // ✅ USAR apiService en lugar de fetch directo
      const response = await apiService.post('/jefe/trazabilidad/report', {
        filters,
        reportType,
        format: 'csv'
      }, {
        responseType: 'text' // ← IMPORTANTE para recibir CSV
      });

      return response;

    } catch (error) {
      console.error('❌ [jefeService] Error en generateReport:', error);
      throw error;
    }
  },

  // ============================================
  // FILTROS DINÁMICOS - NUEVOS MÉTODOS
  // ============================================

  async getFilterOptions(): Promise<FilterOptions> {
    try {

      // ✅ Usar apiService en lugar de fetch directo
      const response = await apiService.get('/jefe/trazabilidad/filter-options');

      // ✅ Manejar diferentes estructuras de respuesta
      let data;
      if (response.data) {
        // Si la respuesta tiene estructura { success, data }
        data = response.data;
      } else if (response.ejecutivas !== undefined) {
        // Si la respuesta es directa { ejecutivas, empresas, clientes }
        data = response;
      } else {
        throw new Error('Estructura de respuesta inválida');
      }
      return data;

    } catch (error) {
      console.error('❌ [jefeService] Error obteniendo opciones de filtro:', error);

      // ✅ Llamar a la solución temporal
      return await this.getRealDataFromOtherEndpoints();
    }
  },

  // ✅ NUEVO MÉTODO: Obtener datos reales de endpoints existentes
  async getRealDataFromOtherEndpoints(): Promise<FilterOptions> {
    try {

      const [ejecutivas, empresas, clientes] = await Promise.all([
        this.getEjecutivas(),
        this.getEmpresas(),
        this.getClientes()
      ]);

      return {
        ejecutivas: ejecutivas
          .filter(e => e.estado_ejecutiva === 'Activo' || e.activo)
          .map(e => ({
            id: e.id_ejecutiva || e.id_usuario,
            nombre_completo: e.nombre_completo || `${e.nombre} ${e.apellido}`
          })),
        empresas: empresas
          .filter(emp => emp.estado === 'Activo' || emp.activo)
          .map(emp => ({
            id: emp.id_empresa,
            razon_social: emp.razon_social || emp.nombre_empresa
          })),
        clientes: clientes.map(cli => ({
          id: cli.id_cliente_final,
          razon_social: cli.razon_social
        }))
      };
    } catch (error) {
      console.error('❌ [jefeService] Error obteniendo datos reales:', error);

      // 🔥 Último recurso: datos mock
      return this.getMockFilterOptions();
    }
  },

  getMockFilterOptions(): FilterOptions {
    console.log('⚠️ [jefeService] Usando datos mockeados como último recurso');
    return {
      ejecutivas: [
        { id: 1, nombre_completo: 'Jherson Medrano' },
        { id: 2, nombre_completo: 'Pedro Suarez' },
        { id: 3, nombre_completo: 'Ana García' },
        { id: 4, nombre_completo: 'Luis Fernández' }
      ],
      empresas: [
        { id: 1, razon_social: 'Rimac Seguros' },
        { id: 2, razon_social: 'Ron Cartavio S.A.' },
        { id: 3, razon_social: 'Tech Solutions Perú' }
      ],
      clientes: [
        { id: 1, razon_social: 'SuperMarket Perú S.A.' },
        { id: 2, razon_social: 'Banco de Crédito del Perú' },
        { id: 3, razon_social: 'Clínica Internacional' },
        { id: 4, razon_social: 'Universidad San Marcos' }
      ]
    };
  },

  // ============================================
  // PERFIL
  // ============================================
  async getPerfil(): Promise<PerfilJefe> {
    const token = sessionStorage.getItem('auth_token');

    try {
      const response: any = await apiService.get('/jefe/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });


      const perfilData = response.data || response;

      return {
        id_jefe: perfilData.id_jefe,
        dni: perfilData.dni,
        nombre_completo: perfilData.nombre_completo,
        email: perfilData.email,
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
  mapClienteFromDB(dbCliente: any): ClienteFinal {

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

      // ✅ CORREGIDO: Usar los nombres correctos del backend
      ejecutiva_nombre: dbCliente.ejecutiva_asignada || dbCliente.ejecutiva?.nombre_completo,

      id_empresa_prov: dbCliente.id_empresa_prov,

      // ✅ CORREGIDO: Usar los nombres correctos del backend  
      empresa_nombre: dbCliente.empresa_proveedora || dbCliente.empresa?.razon_social,

      fecha_creacion: dbCliente.fecha_creacion,
      fecha_actualizacion: dbCliente.fecha_actualizacion,
      total_actividades: dbCliente.total_actividades || 0,
      estado: dbCliente.estado || 'Activo'
    };
  },

  // En jefeService.ts - agregar estos nuevos métodos

  // NUEVOS MÉTODOS PARA LOS GRÁFICOS CORREGIDOS
  async getTrazabilidadNuevasReuniones(meses: number = 6, ejecutivaId?: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('meses', meses.toString());
    if (ejecutivaId) params.append('ejecutivaId', ejecutivaId.toString());

    return apiService.get(`/jefe/trazabilidad/kpis/nuevas-reuniones?${params.toString()}`);
  },

  async getTrazabilidadNuevasVentas(meses: number = 6, ejecutivaId?: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('meses', meses.toString());
    if (ejecutivaId) params.append('ejecutivaId', ejecutivaId.toString());

    return apiService.get(`/jefe/trazabilidad/kpis/nuevas-ventas?${params.toString()}`);
  },

  async getTrazabilidadEfectividadCanales(filters?: {
    ejecutivaId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) params.append('ejecutivaId', filters.ejecutivaId.toString());
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    return apiService.get(`/jefe/trazabilidad/kpis/efectividad-canales?${params.toString()}`);
  },

  async getTrazabilidadResumenSemanal(): Promise<any> {
    return apiService.get('/jefe/trazabilidad/kpis/resumen-semanal');
  },

  async getTrazabilidadEmbudoVentas(filters?: {
    ejecutivaId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.ejecutivaId) params.append('ejecutivaId', filters.ejecutivaId.toString());
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    return apiService.get(`/jefe/trazabilidad/kpis/embudo-ventas?${params.toString()}`);
  },

  async getTrazabilidadRankingEjecutivas(filters?: {
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    return apiService.get(`/jefe/trazabilidad/kpis/ranking-ejecutivas?${params.toString()}`);
  },

};