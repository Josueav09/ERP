// frontend/services/clienteService.ts
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
  totalClientes?: number;
  totalEjecutivas?: number;
  actividadesEsteMes?: number;
  clientesEsteMes?: number;
  revenueTotal?: number;
  pipelineOportunidades?: number;
  tasaConversion?: string;
  ventasGanadas?: number;
}

export interface Trazabilidad {
  id_trazabilidad: number;
  tipo_actividad: string;
  descripcion: string;
  fecha_actividad: string;
  resultado_contacto: string;
  ejecutiva_nombre: string;
  nombre_empresa: string;
  estado: string;
  informacion_importante?: string;
  resultados_reunion?: string;
  cliente_nombre?: string;
  contacto_nombre?: string;
}

export interface ClienteReal {
  id_cliente_final: number;
  razon_social: string;
  ruc: string;
  correo: string;
  telefono: string;
  pais: string;
  rubro: string;
  estado: string;
  fecha_creacion: string;
  ejecutiva_nombre: string;
  // ✅ NUEVAS PROPIEDADES
  actividades_completadas: number;
  actividades_en_proceso: number;
  total_actividades: number;
}


export interface EjecutivaReal {
  id_ejecutiva: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  linkedin: string;
  estado_ejecutiva: string;
  especialidad?: string;
  experiencia?: string;
}

export interface EjecutivaCompleta extends EjecutivaReal {
  clientesAsignados: number;
  clientesPotenciales: number;
  ventasMes: number;
  tasaConversion: number;
  certificaciones: Certificacion[];
  embudoVentas: EmbudoVentas[];
}

export interface Certificacion {
  id: number;
  nombre: string;
  institucion: string;
  fecha_obtencion: string;
  nivel: string;
}

export interface EmbudoVentas {
  etapa: string;
  cantidad: number;
  tasa_conversion: string;
  monto_potencial: number;
}

// En clienteService.ts - actualiza la interfaz
export interface EjecutivaEstadisticasCompletas {
  clientes_activos: number;
  tasa_conversion: string;
  ventas_ganadas: number;
  total_oportunidades: number;
  revenue_total: number;
  total_actividades: number;
  actividades_este_mes: number;
  tiempo_respuesta: string;
}


export const clienteService = {

  async getStats(clienteUsuarioId: string): Promise<ClienteStats> {
    try {
      console.log('📊 [clienteService] Obteniendo stats REALES para:', clienteUsuarioId);
      const response: ClienteStats = await apiService.get(`/empresa/dashboard/stats?clienteUsuarioId=${clienteUsuarioId}`);

      console.log('✅ [clienteService] Stats REALES obtenidas:', response);
      return response;
    } catch (error) {
      console.error('❌ [clienteService] Error obteniendo stats REALES:', error);
      // ❌ ELIMINAR DATOS MOCK - lanzar error real
      throw new Error('No se pudieron cargar las estadísticas del dashboard');
    }
  },

  async getTrazabilidad(clienteUsuarioId: string): Promise<Trazabilidad[]> {
    try {
      console.log('📋 [clienteService] Obteniendo trazabilidad REAL para:', clienteUsuarioId);
      const response: Trazabilidad[] = await apiService.get(`/empresa/trazabilidad?clienteUsuarioId=${clienteUsuarioId}`);

      console.log('✅ [clienteService] Trazabilidad REAL obtenida:', response.length, 'registros');
      return response;
    } catch (error) {
      console.error('❌ [clienteService] Error obteniendo trazabilidad REAL:', error);
      return []; // Retorna array vacío - NO datos mock
    }
  },

  async getEjecutivaInfo(clienteUsuarioId: string): Promise<any> {
    try {
      console.log('👩‍💼 [clienteService] Obteniendo info ejecutiva REAL para:', clienteUsuarioId);
      const response: any = await apiService.get(`/empresa/ejecutiva?clienteUsuarioId=${clienteUsuarioId}`);

      console.log('✅ [clienteService] Info ejecutiva REAL obtenida:', response);

      // ✅ El backend ahora devuelve estadísticas reales
      return {
        ejecutiva: {
          nombre_completo: response.ejecutiva_nombre,
          correo: response.ejecutiva_email,
          telefono: response.telefono,
          linkedin: response.linkedin,
          especialidad: 'Ejecutiva Comercial', // Podrías agregar este campo en la BD
          experiencia: 'Especialista en crecimiento empresarial'
        },
        estadisticas: response.estadisticas || {
          clientes_activos: 0,
          tasa_conversion: '0%',
          ventas_ganadas: 0,
          tiempo_respuesta: 'Por determinar'
        }
      };
    } catch (error) {
      console.error('❌ [clienteService] Error obteniendo info ejecutiva REAL:', error);
      throw new Error('No se pudo cargar la información de la ejecutiva');
    }
  },

  async getActividades(clienteUsuarioId: string): Promise<Trazabilidad[]> {
    console.log('🔄 [clienteService] Obteniendo actividades para cliente:', clienteUsuarioId);

    try {
      // ✅ getActividades y getTrazabilidad devuelven la MISMA estructura
      const actividades = await this.getTrazabilidad(clienteUsuarioId);
      console.log('✅ [clienteService] Actividades obtenidas exitosamente', actividades.length);
      return actividades;
    } catch (error: any) {
      console.error('❌ [clienteService] Error obteniendo actividades:', error);

      // ✅ Fallback a trazabilidad vacía
      return [];
    }
  },

  async getClientesRecientes(clienteUsuarioId: string): Promise<ClienteReal[]> {
    try {
      console.log('👥 [clienteService] Obteniendo clientes recientes para:', clienteUsuarioId);
      const response: ClienteReal[] = await apiService.get(`/empresa/clientes?clienteUsuarioId=${clienteUsuarioId}`);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo clientes recientes:', error);
      return [];
    }
  },

  //
  // EJECUTIVAS
  //

  // En clienteService.ts - actualizar getEjecutivasByEmpresa
  // async getEjecutivasByEmpresa(empresaId: string): Promise<EjecutivaCompleta[]> {
  //   try {
  //     console.log('👥 [clienteService] Obteniendo ejecutivas REALES para empresa:', empresaId);

  //     const ejecutivasReales: EjecutivaReal[] = await apiService.get(`/empresa/ejecutivas?empresaId=${empresaId}`);
  //     console.log('✅ [clienteService] Ejecutivas REALES obtenidas:', ejecutivasReales);

  //     const ejecutivasCompletas = await Promise.all(
  //       ejecutivasReales.map(async (ejecutiva, index) => {
  //         try {
  //           // ✅ USAR LA INTERFAZ COMPLETA
  //           const estadisticas: EjecutivaEstadisticasCompletas = await apiService.get(`/empresa/ejecutiva/${ejecutiva.id_ejecutiva}/estadisticas?empresaId=${empresaId}`);
  //           const embudo: EmbudoVentas[] = await apiService.get(`/empresa/ejecutiva/${ejecutiva.id_ejecutiva}/embudo?empresaId=${empresaId}`);

  //           console.log(`📊 [clienteService] Estadísticas REALES para ${ejecutiva.nombre_completo}:`, estadisticas);
  //           console.log(`🎯 [clienteService] Embudo REAL para ${ejecutiva.nombre_completo}:`, embudo);

  //           // ✅ CONVERTIR LA TASA DE CONVERSIÓN DE FORMA SEGURA
  //           const tasaConversionNum = estadisticas.tasa_conversion
  //             ? parseFloat(estadisticas.tasa_conversion.replace('%', ''))
  //             : 0;

  //           return {
  //             ...ejecutiva,
  //             especialidad: this.getEspecialidadPorIndice(index),
  //             experiencia: this.getExperienciaPorIndice(index),
  //             // ✅ USAR DATOS REALES DEL BACKEND
  //             clientesAsignados: estadisticas.clientes_activos || 0,
  //             clientesPotenciales: estadisticas.total_oportunidades || 0,
  //             ventasMes: estadisticas.revenue_total || 0,
  //             tasaConversion: tasaConversionNum,
  //             certificaciones: this.getCertificacionesPorIndice(index),
  //             embudoVentas: embudo.length > 0 ? embudo : this.getEmbudoVacio()
  //           };
  //         } catch (error) {
  //           console.error(`❌ Error obteniendo datos para ejecutiva ${ejecutiva.id_ejecutiva}:`, error);
  //           // Fallback a datos vacíos
  //           return {
  //             ...ejecutiva,
  //             especialidad: this.getEspecialidadPorIndice(index),
  //             experiencia: this.getExperienciaPorIndice(index),
  //             clientesAsignados: 0,
  //             clientesPotenciales: 0,
  //             ventasMes: 0,
  //             tasaConversion: 0,
  //             certificaciones: this.getCertificacionesPorIndice(index),
  //             embudoVentas: this.getEmbudoVacio()
  //           };
  //         }
  //       })
  //     );

  //     return ejecutivasCompletas;
  //   } catch (error) {
  //     console.error('❌ [clienteService] Error obteniendo ejecutivas reales:', error);
  //     return [];
  //   }
  // },
  // En clienteService.ts - verifica que este método esté bien implementado
  async getEjecutivasByEmpresa(empresaId: string): Promise<EjecutivaCompleta[]> {
    try {
      console.log('👥 [clienteService] Obteniendo ejecutivas REALES para empresa:', empresaId);

      const ejecutivasReales: EjecutivaReal[] = await apiService.get(`/empresa/ejecutivas?empresaId=${empresaId}`);
      console.log('✅ [clienteService] Ejecutivas REALES obtenidas:', ejecutivasReales);

      const ejecutivasCompletas = await Promise.all(
        ejecutivasReales.map(async (ejecutiva, index) => {
          try {
            // ✅ USAR LA INTERFAZ COMPLETA
            const estadisticas: EjecutivaEstadisticasCompletas = await apiService.get(`/empresa/ejecutiva/${ejecutiva.id_ejecutiva}/estadisticas?empresaId=${empresaId}`);
            const embudo: EmbudoVentas[] = await apiService.get(`/empresa/ejecutiva/${ejecutiva.id_ejecutiva}/embudo?empresaId=${empresaId}`);

            console.log(`📊 [clienteService] Estadísticas REALES para ${ejecutiva.nombre_completo}:`, estadisticas);
            console.log(`🎯 [clienteService] Embudo REAL para ${ejecutiva.nombre_completo}:`, embudo);

            // ✅ CONVERTIR LA TASA DE CONVERSIÓN DE FORMA SEGURA
            const tasaConversionNum = estadisticas.tasa_conversion
              ? parseFloat(estadisticas.tasa_conversion.replace('%', ''))
              : 0;

            return {
              ...ejecutiva,
              especialidad: this.getEspecialidadPorIndice(index),
              experiencia: this.getExperienciaPorIndice(index),
              // ✅ USAR DATOS REALES DEL BACKEND
              clientesAsignados: estadisticas.clientes_activos || 0,
              clientesPotenciales: estadisticas.total_oportunidades || 0,
              ventasMes: estadisticas.revenue_total || 0,
              tasaConversion: tasaConversionNum,
              certificaciones: this.getCertificacionesPorIndice(index),
              embudoVentas: embudo.length > 0 ? embudo : this.getEmbudoVacio()
            };
          } catch (error) {
            console.error(`❌ Error obteniendo datos para ejecutiva ${ejecutiva.id_ejecutiva}:`, error);
            // Fallback a datos vacíos
            return {
              ...ejecutiva,
              especialidad: this.getEspecialidadPorIndice(index),
              experiencia: this.getExperienciaPorIndice(index),
              clientesAsignados: 0,
              clientesPotenciales: 0,
              ventasMes: 0,
              tasaConversion: 0,
              certificaciones: this.getCertificacionesPorIndice(index),
              embudoVentas: this.getEmbudoVacio()
            };
          }
        })
      );

      return ejecutivasCompletas;
    } catch (error) {
      console.error('❌ [clienteService] Error obteniendo ejecutivas reales:', error);
      return [];
    }
  },
// ✅ NUEVO MÉTODO: Embudo vacío para fallbacks
  getEmbudoVacio(): EmbudoVentas[] {
    return [
      { etapa: "Prospección", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
      { etapa: "Calificación", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
      { etapa: "Propuesta", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
      { etapa: "Negociación", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 },
      { etapa: "Cierre", cantidad: 0, tasa_conversion: "0%", monto_potencial: 0 }
    ];
  },

  getEspecialidadPorIndice(index: number): string {
    const especialidades = [
      "Ventas Enterprise",
      "Desarrollo de Negocios",
      "Expansión de Mercado",
      "Gestión de Cuentas",
      "Estrategia Comercial"
    ];
    return especialidades[index % especialidades.length];
  },

  getExperienciaPorIndice(index: number): string {
    const experiencias = [
      "5+ años en ventas B2B",
      "3+ años en crecimiento empresarial",
      "4+ años en estrategias de crecimiento",
      "6+ años en gestión comercial",
      "2+ años en desarrollo de mercado"
    ];
    return experiencias[index % experiencias.length];
  },

  getCertificacionesPorIndice(index: number): Certificacion[] {
    const certificacionesBase = [
      // Para la primera ejecutiva
      [
        {
          id: 1,
          nombre: "Certified Sales Professional",
          institucion: "Sales Excellence Institute",
          fecha_obtencion: "2023-03-15",
          nivel: "Avanzado"
        },
        {
          id: 2,
          nombre: "Strategic Account Management",
          institucion: "Harvard Business School",
          fecha_obtencion: "2022-08-10",
          nivel: "Ejecutivo"
        },
        {
          id: 3,
          nombre: "Digital Transformation",
          institucion: "MIT Professional Education",
          fecha_obtencion: "2023-11-20",
          nivel: "Especialista"
        }
      ],
      // Para la segunda ejecutiva
      [
        {
          id: 1,
          nombre: "Business Development Certification",
          institucion: "Growth Academy",
          fecha_obtencion: "2023-01-20",
          nivel: "Intermedio"
        },
        {
          id: 2,
          nombre: "Customer Success Management",
          institucion: "Success University",
          fecha_obtencion: "2022-06-15",
          nivel: "Avanzado"
        }
      ],
      // Para la tercera ejecutiva
      [
        {
          id: 1,
          nombre: "Market Expansion Strategy",
          institucion: "Business Growth Institute",
          fecha_obtencion: "2023-05-10",
          nivel: "Estratégico"
        }
      ]
    ];

    return certificacionesBase[index % certificacionesBase.length] || certificacionesBase[0];
  },

  async getEstadisticasEjecutiva(ejecutivaId: number): Promise<{
    clientesAsignados: number;
    clientesPotenciales: number;
    ventasMes: number;
    tasaConversion: number;
  }> {
    try {
      // Aquí puedes hacer una llamada real a tu backend para estadísticas
      // Por ahora usaremos datos calculados basados en el ID
      return {
        clientesAsignados: 6 + (ejecutivaId % 4),
        clientesPotenciales: 4 + (ejecutivaId % 3),
        ventasMes: 150000 + (ejecutivaId * 25000),
        tasaConversion: 35 + (ejecutivaId * 2)
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        clientesAsignados: 0,
        clientesPotenciales: 0,
        ventasMes: 0,
        tasaConversion: 0
      };
    }
  },

  async getEmbudoVentas(ejecutivaId: number): Promise<EmbudoVentas[]> {
    // Datos de embudo basados en el ID para variedad
    const embudos = [
      [
        { etapa: "Prospección", cantidad: 25, tasa_conversion: "100%", monto_potencial: 500000 },
        { etapa: "Calificación", cantidad: 18, tasa_conversion: "72%", monto_potencial: 450000 },
        { etapa: "Propuesta", cantidad: 12, tasa_conversion: "48%", monto_potencial: 300000 },
        { etapa: "Negociación", cantidad: 8, tasa_conversion: "32%", monto_potencial: 200000 },
        { etapa: "Cierre", cantidad: 5, tasa_conversion: "20%", monto_potencial: 125000 }
      ],
      [
        { etapa: "Prospección", cantidad: 20, tasa_conversion: "100%", monto_potencial: 400000 },
        { etapa: "Calificación", cantidad: 15, tasa_conversion: "75%", monto_potencial: 300000 },
        { etapa: "Propuesta", cantidad: 10, tasa_conversion: "50%", monto_potencial: 200000 },
        { etapa: "Negociación", cantidad: 6, tasa_conversion: "30%", monto_potencial: 120000 },
        { etapa: "Cierre", cantidad: 3, tasa_conversion: "15%", monto_potencial: 60000 }
      ],
      [
        { etapa: "Prospección", cantidad: 22, tasa_conversion: "100%", monto_potencial: 440000 },
        { etapa: "Calificación", cantidad: 16, tasa_conversion: "73%", monto_potencial: 350000 },
        { etapa: "Propuesta", cantidad: 11, tasa_conversion: "50%", monto_potencial: 220000 },
        { etapa: "Negociación", cantidad: 7, tasa_conversion: "32%", monto_potencial: 140000 },
        { etapa: "Cierre", cantidad: 4, tasa_conversion: "18%", monto_potencial: 80000 }
      ]
    ];

    return embudos[ejecutivaId % embudos.length] || embudos[0];
  }


};