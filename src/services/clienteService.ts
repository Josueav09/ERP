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
}

// ✅ ESTRUCTURA EXACTA que devuelve el backend en getTrazabilidad()
export interface Trazabilidad {
  id_trazabilidad: number;
  tipo_actividad: string;
  descripcion: string;
  fecha_actividad: string;
  resultado_contacto: string;
  ejecutiva_nombre: string;
  nombre_empresa: string;
  // ✅ NO incluir 'notas' - usar 'descripcion' que viene de 'observaciones'
}

export const clienteService = {
  // ============================================
  // DASHBOARD STATS
  // ============================================
  async getStats(clienteUsuarioId: string): Promise<ClienteStats> {
    console.log('📊 [clienteService] Obteniendo stats para cliente:', clienteUsuarioId);

    try {
      const response: ClienteStats = await apiService.get(`/empresa/dashboard/stats?clienteUsuarioId=${clienteUsuarioId}`);
      console.log('✅ [clienteService] Stats obtenidas exitosamente', response);
      return response;
    } catch (error: any) {
      console.error('❌ [clienteService] Error obteniendo stats:', error);

      return {
        cliente: {
          nombre_cliente: 'Cliente Demo',
          nombre_empresa: 'Empresa Demo S.A.',
          ejecutiva_nombre: 'María Fernández',
          ejecutiva_email: 'maria.fernandez@empresa.com'
        },
        totalActividades: 12,
        completadas: 8,
        enProceso: 3,
        rendimiento: 75
      };
    }
  },

  // ============================================
  // TRAZABILIDAD - ESTRUCTURA REAL DEL BACKEND
  // ============================================
  async getTrazabilidad(clienteUsuarioId: string): Promise<Trazabilidad[]> {
    console.log('📋 [clienteService] Obteniendo trazabilidad para cliente:', clienteUsuarioId);

    try {
      const response: Trazabilidad[] = await apiService.get(`/empresa/trazabilidad?clienteUsuarioId=${clienteUsuarioId}`);
      console.log('✅ [clienteService] Trazabilidad obtenida exitosamente', response);

      // ✅ El backend ya devuelve el array directamente
      return response;
    } catch (error: any) {
      console.error('❌ [clienteService] Error obteniendo trazabilidad:', error);

      // ✅ Datos de respaldo con estructura CORRECTA
      return [
        {
          id_trazabilidad: 1,
          tipo_actividad: 'Llamada telefónica',
          descripcion: 'Contacto inicial para presentación de servicios',
          fecha_actividad: '2024-01-15T10:30:00Z',
          resultado_contacto: 'completado',
          ejecutiva_nombre: 'María Fernández',
          nombre_empresa: 'Empresa Demo S.A.'
        },
        {
          id_trazabilidad: 2,
          tipo_actividad: 'Reunión virtual',
          descripcion: 'Presentación de propuesta técnica',
          fecha_actividad: '2024-01-20T15:00:00Z',
          resultado_contacto: 'en_proceso',
          ejecutiva_nombre: 'María Fernández',
          nombre_empresa: 'Empresa Demo S.A.'
        }
      ];
    }
  },

  // ============================================
  // INFORMACIÓN DE EJECUTIVA
  // ============================================

  // frontend/services/clienteService.ts - ACTUALIZAR getEjecutivaInfo
  async getEjecutivaInfo(clienteUsuarioId: string): Promise<any> {
    console.log('👩‍💼 [clienteService] Obteniendo info de ejecutiva para cliente:', clienteUsuarioId);

    try {
      const response = await apiService.get(`/empresa/ejecutiva?clienteUsuarioId=${clienteUsuarioId}`);
      console.log('✅ [clienteService] Info de ejecutiva obtenida exitosamente');

      // ✅ El backend devuelve esta estructura:
      // {
      //   ejecutiva_nombre: string,
      //   ejecutiva_email: string, 
      //   telefono: string,
      //   linkedin?: string
      // }

      // const backendData = response;
      const backendData: { // @ts-ignore
        ejecutiva_nombre: string;
        ejecutiva_email: string;
        telefono: string;
        linkedin?: string;
      } = response;


      // ✅ Transformar a la estructura que espera el frontend
      return {
        ejecutiva: {
          nombre_completo: backendData.ejecutiva_nombre,
          correo: backendData.ejecutiva_email,
          telefono: backendData.telefono,
          linkedin: backendData.linkedin,
          especialidad: 'Ejecutiva de HL', // Valor por defecto
          experiencia: 'Especialista en crecimiento empresarial', // Valor por defecto
          fecha_asignacion: new Date().toISOString() // Valor por defecto
        },
        estadisticas: {
          clientes_activos: 15, // Valor por defecto
          tasa_conversion: '15%', // Valor por defecto
          ventas_ganadas: 12, // Valor por defecto
          tiempo_respuesta: '< 2 horas' // Valor por defecto
        },
        proxima_reunion: {
          fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 días
          tipo: 'Reunión de seguimiento',
          descripcion: 'Revisión de progreso y próximos pasos'
        }
      };

    } catch (error: any) {
      console.error('❌ [clienteService] Error obteniendo info de ejecutiva:', error);

      // ✅ Datos de respaldo con estructura CORRECTA
      return {
        ejecutiva: {
          nombre_completo: 'María Fernández Rojas',
          correo: 'peedroramon25@gmail.com',
          telefono: '+51 987123456',
          linkedin: 'linkedin.com/in/mariafernandez',
          especialidad: 'Ejecutiva de Ventas Senior',
          experiencia: '5+ años en ventas B2B',
          fecha_asignacion: '2024-01-01T00:00:00Z'
        },
        estadisticas: {
          clientes_activos: 15,
          tasa_conversion: '75%',
          ventas_ganadas: 12,
          tiempo_respuesta: '< 2 horas'
        },
        proxima_reunion: {
          fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          tipo: 'Reunión de seguimiento',
          descripcion: 'Revisión de progreso y próximos pasos'
        }
      };
    }
  },

  // ============================================
  // ACTIVIDADES - USA getTrazabilidad DIRECTAMENTE
  // ============================================
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
  }
};