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
  // Campos opcionales para compatibilidad
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

// export interface Trazabilidad {
//   id_trazabilidad: number;
//   id_ejecutiva: number;
//   id_empresa: number;
//   id_cliente: number;
//   tipo_actividad: string;
//   descripcion: string;
//   fecha_actividad: string;
//   estado: string;
//   notas: string;
//   ejecutiva_nombre: string;
//   ejecutiva_activa: boolean;
//   nombre_empresa: string;
//   nombre_cliente: string;
// }

export interface Trazabilidad {
  id_trazabilidad: number;
  id_ejecutiva: number;
  id_empresa: number;
  id_cliente: number;
  tipo_actividad: string;  // Viene de tipo_contacto en BD
  descripcion: string;     // Generado desde observaciones + resultado_contacto
  fecha_actividad: string; // Viene de fecha_contacto en BD
  estado: string;          // Mapeado desde etapa_oportunidad
  notas: string;           // Viene de observaciones en BD
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

  // Ejecutivas - CON MAPEO CORREGIDO
  async getEjecutivas(): Promise<Ejecutiva[]> {
    const data = await apiService.get('/jefe/ejecutivas');
    console.log('📥 Datos CRUDOS de ejecutivas del backend:', data);
    const ejecutivasMapeadas = (data as any[]).map((ejecutiva: any) => this.mapEjecutivaFromDB(ejecutiva));
    console.log('📤 Ejecutivas mapeadas:', ejecutivasMapeadas);
    return ejecutivasMapeadas;
  },

  async getEjecutivaDetalle(id: number): Promise<any> {
    const data = await apiService.get(`/jefe/ejecutivas/${id}`);
    console.log('📥 Detalle CRUDO de ejecutiva:', data);
    const detalleMapeado = this.mapEjecutivaDetalleFromDB(data);
    console.log('📤 Detalle mapeado:', detalleMapeado);
    return detalleMapeado;
  },

  // En tu jefeService.ts - CORREGIDO
  async createEjecutiva(data: any): Promise<any> {
    // const user = await this.getPerfil(); // Obtener usuario actual desde getPerfil
    // const idJefe = user.id_jefe || user.id; // Ajusta según tu estructura de usuario
    const idJefe = 1; // ✅ TEMPORAL - Reemplaza con el ID del jefe actual
    const dbData = {
      dni: data.dni, // ✅ Usar el DNI del formulario
      nombre_completo: `${data.nombre} ${data.apellido}`.trim(), // ✅ REQUERIDO
      correo: data.email, // ✅ REQUERIDO (backend usa 'correo')
      contraseña: data.password, // ✅ REQUERIDO
      telefono: data.telefono || null,
      estado_ejecutiva: 'Activo',
      id_jefe: idJefe// ✅ TEMPORAL - Asignar al jefe actual (deberías obtenerlo del contexto)
    };

    console.log('📤 Enviando datos CORRECTOS de ejecutiva al backend:', dbData);
    return apiService.post('/jefe/ejecutivas', dbData);
  },

  async updateEjecutiva(id: number, data: any): Promise<any> {
    const dbData = {
      nombre_completo: `${data.nombre} ${data.apellido}`.trim(), // ✅ Usar nombre_completo
      correo: data.email, // ✅ Usar correo
      telefono: data.telefono,
      estado_ejecutiva: data.activo ? 'Activo' : 'Inactivo' // ✅ Mapear activo → estado_ejecutiva
    };

    console.log('📤 Enviando datos de actualización:', dbData);
    return apiService.put(`/jefe/ejecutivas/${id}`, dbData);
  },
  // Empresas - CON MAPEO CORREGIDO
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
    console.log('📤 Enviando datos al backend:', dbData);
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
  // async getTrazabilidad(filters?: any): Promise<Trazabilidad[]> {
  //   const params = new URLSearchParams();
  //   if (filters?.empresa) params.append('empresa', filters.empresa);
  //   if (filters?.ejecutiva) params.append('ejecutiva', filters.ejecutiva);
  //   if (filters?.cliente) params.append('cliente', filters.cliente);

  //   return apiService.get(`/jefe/trazabilidad?${params.toString()}`);
  // },

  async getTrazabilidad(filters?: any): Promise<Trazabilidad[]> {
    const params = new URLSearchParams();
    if (filters?.empresa && filters.empresa !== 'all') params.append('empresa', filters.empresa);
    if (filters?.ejecutiva && filters.ejecutiva !== 'all') params.append('ejecutiva', filters.ejecutiva);
    if (filters?.cliente && filters.cliente !== 'all') params.append('cliente', filters.cliente);

    const data = await apiService.get(`/jefe/trazabilidad?${params.toString()}`);
    console.log('📥 Datos CRUDOS de trazabilidad del backend:', data);

    // ✅ MAPEAR a la estructura que espera el frontend
    const trazabilidadMapeada = (data as any[]).map((item: any) =>
      this.mapTrazabilidadFromDB(item)
    );
    console.log('📤 Trazabilidad mapeada:', trazabilidadMapeada);

    return trazabilidadMapeada;
  },

  // // Perfil
  // async getPerfil(): Promise<any> {
  //   const token = sessionStorage.getItem('auth_token'); // o donde guardes el token

  //   console.log('Perfil obtenido:', token);
  //   return apiService.get('/jefe/perfil', {
  //     headers: {
  //       'Authorization': `Bearer ${token}` // ← DEBE ESTAR PRESENTE
  //     }

  //   });
  // },

  // Actualiza tu servicio
  async getPerfil(): Promise<PerfilJefe> {
    const token = sessionStorage.getItem('auth_token');

    console.log('🔐 Token para perfil:', token);

    try {
      const response: any = await apiService.get('/jefe/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📋 Respuesta completa del perfil:', response);

      // Ajusta según la estructura real de tu API
      const perfilData = response.data?.data || response.data || response;

      // Mapear a la interfaz si es necesario
      return {
        id_jefe: perfilData.id_jefe,
        dni: perfilData.dni,
        nombre_completo: perfilData.nombre_completo,
        email: perfilData.correo,
        telefono: perfilData.telefono,
        linkedin: perfilData.linkedin,
        rol: perfilData.rol || 'Jefe', // Valor por defecto
        fecha_creacion: perfilData.fecha_creacion,
        fecha_actualizacion: perfilData.fecha_actualizacion
      };

    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  },


  async updatePerfil(data: any): Promise<any> {
    return apiService.put('/jefe/perfil', data);
  },

  async updatePassword(data: any): Promise<any> {
    return apiService.put('/jefe/perfil/password', data);
  },

  // ✅ MÉTODO PARA MAPEAR EJECUTIVAS DESDE LA BD
  mapEjecutivaFromDB(dbEjecutiva: any): Ejecutiva {
    // Dividir nombre_completo en nombre y apellido para el frontend
    const nombreCompleto = dbEjecutiva.nombre_completo || '';
    const nombreParts = nombreCompleto.split(' ');
    const nombre = nombreParts[0] || '';
    const apellido = nombreParts.slice(1).join(' ') || '';

    return {
      id_usuario: dbEjecutiva.id_ejecutiva,
      nombre: nombre,
      apellido: apellido,
      email: dbEjecutiva.correo, // ✅ Mapear correo → email
      telefono: dbEjecutiva.telefono,
      rol: 'ejecutiva',
      activo: dbEjecutiva.estado_ejecutiva === 'Activo',
      total_empresas: dbEjecutiva.empresa_asignada && dbEjecutiva.empresa_asignada !== 'Sin asignar' ? 1 : 0,
      total_clientes: dbEjecutiva.total_clientes || 0,
      total_actividades: dbEjecutiva.total_actividades || 0,
      // Campos opcionales para compatibilidad
      estado_ejecutiva: dbEjecutiva.estado_ejecutiva,
      nombre_completo: dbEjecutiva.nombre_completo,
      correo: dbEjecutiva.correo
    };
  },

  // ✅ MÉTODO PARA MAPEAR DETALLE DE EJECUTIVA
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

  // Método para mapear empresas
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
    // Determinar estado para el frontend basado en etapa_oportunidad
    let estadoFrontend = 'pendiente';
    if (dbTrazabilidad.etapa_oportunidad === 'Venta ganada') estadoFrontend = 'completado';
    else if (['Negociación', 'Presentación de propuesta', 'Manejo de objeciones'].includes(dbTrazabilidad.etapa_oportunidad))
      estadoFrontend = 'en_proceso';
    else if (dbTrazabilidad.etapa_oportunidad === 'Venta perdida') estadoFrontend = 'cancelado';

    // Generar descripción para el frontend
    const descripcion = dbTrazabilidad.observaciones ||
      `Contacto ${dbTrazabilidad.tipo_contacto} - ${dbTrazabilidad.resultado_contacto} - Etapa: ${dbTrazabilidad.etapa_oportunidad}`;

    return {
      id_trazabilidad: dbTrazabilidad.id_trazabilidad,
      id_ejecutiva: dbTrazabilidad.id_ejecutiva || dbTrazabilidad.ejecutiva?.id_ejecutiva,
      id_empresa: dbTrazabilidad.id_empresa_prov || dbTrazabilidad.empresa_proveedora?.id_empresa_prov,
      id_cliente: dbTrazabilidad.id_cliente_final || dbTrazabilidad.cliente_final?.id_cliente_final,
      tipo_actividad: dbTrazabilidad.tipo_contacto, // ✅ tipo_contacto → tipo_actividad
      descripcion: descripcion,
      fecha_actividad: dbTrazabilidad.fecha_contacto, // ✅ fecha_contacto → fecha_actividad
      estado: estadoFrontend,
      notas: dbTrazabilidad.observaciones || '',
      ejecutiva_nombre: dbTrazabilidad.ejecutiva?.nombre_completo || dbTrazabilidad.ejecutiva_nombre || 'N/A',
      ejecutiva_activa: dbTrazabilidad.ejecutiva?.estado_ejecutiva === 'Activo',
      nombre_empresa: dbTrazabilidad.empresa_proveedora?.razon_social || dbTrazabilidad.empresa_nombre || 'N/A',
      nombre_cliente: dbTrazabilidad.cliente_final?.razon_social || dbTrazabilidad.cliente_nombre || 'N/A'
    };
  },
};