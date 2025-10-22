
import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Target } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ejecutivaService } from "@/services/ejecutivaService"
import { toast } from "sonner"

interface AddTrazabilidadDialogProps {
  ejecutivaId: string
  onSuccess: () => void
  onClose: () => void
  open?: boolean
}

interface Cliente {
  id_cliente_final: number
  razon_social: string
}

interface PersonaContacto {
  id_contacto: number
  nombre_completo: string
  cargo?: string
}

interface Empresa {
  id_empresa_prov: number
  razon_social: string
}

export function AddTrazabilidadDialog({ ejecutivaId, onSuccess, onClose, open = false }: AddTrazabilidadDialogProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("etapa1")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [contactos, setContactos] = useState<PersonaContacto[]>([])
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingContactos, setLoadingContactos] = useState(false)
  
  const [formData, setFormData] = useState({
    // Cliente y contacto
    id_cliente_final: "",
    id_contacto: "",
    
    // Etapa 1
    tipo_contacto: "",
    fecha_contacto: new Date().toISOString().split('T')[0],
    resultado_contacto: "",
    informacion_importante: "",
    reunion_agendada: false,
    fecha_reunion: "",
    participantes: "",
    se_dio_reunion: false,
    resultados_reunion: "",
    pasa_embudo_ventas: false,
    
    // Etapa 2 (solo si pasa_embudo_ventas = true)
    nombre_oportunidad: "",
    etapa_oportunidad: "",
    producto_ofrecido: "",
    fecha_cierre_esperado: "",
    monto_total_sin_imp: "",
    probabilidad_cierre: "",
    observaciones: ""
  })

  useEffect(() => {
    if (open) {
      fetchEmpresaAsignada()
      fetchClientes()
    }
  }, [open])

  useEffect(() => {
    if (formData.id_cliente_final) {
      fetchContactos(formData.id_cliente_final)
    } else {
      setContactos([])
      setFormData(prev => ({ ...prev, id_contacto: "" }))
    }
  }, [formData.id_cliente_final])

  const fetchEmpresaAsignada = async () => {
    try {
      console.log('🏢 Fetching empresa asignada for ejecutiva:', ejecutivaId)
      const empresaData = await ejecutivaService.getEmpresaAsignada(ejecutivaId)
      setEmpresa(empresaData)
      
      if (!empresaData) {
        toast.error("No tienes una empresa asignada")
        console.error('❌ Ejecutiva no tiene empresa asignada')
      } else {
        console.log('✅ Empresa asignada:', empresaData.razon_social)
      }
    } catch (error) {
      console.error("❌ Error fetching empresa asignada:", error)
      toast.error("Error al cargar información de la empresa")
    }
  }

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true)
      console.log('👥 Fetching clientes for ejecutiva:', ejecutivaId)
      
      const clientesData = await ejecutivaService.getClientes(ejecutivaId)
      setClientes(clientesData)
      
      console.log(`✅ Clientes cargados: ${clientesData.length}`)
    } catch (error) {
      console.error("❌ Error fetching clientes:", error)
      toast.error("Error al cargar clientes")
    } finally {
      setLoadingClientes(false)
    }
  }

  const fetchContactos = async (clienteId: string) => {
    try {
      setLoadingContactos(true)
      console.log('📞 Fetching contactos for cliente:', clienteId)
      
      const contactosData = await ejecutivaService.getContactosCliente(clienteId, ejecutivaId)
      setContactos(contactosData)
      
      console.log(`✅ Contactos cargados: ${contactosData.length}`)
    } catch (error) {
      console.error("❌ Error fetching contactos:", error)
      toast.error("Error al cargar contactos del cliente")
    } finally {
      setLoadingContactos(false)
    }
  }

  const validateForm = (): boolean => {
    // Validaciones básicas
    if (!formData.id_cliente_final) {
      toast.error("Debes seleccionar un cliente")
      return false
    }

    if (!formData.id_contacto) {
      toast.error("Debes seleccionar una persona de contacto")
      return false
    }

    if (!formData.tipo_contacto) {
      toast.error("Debes seleccionar el tipo de contacto")
      return false
    }

    if (!formData.resultado_contacto) {
      toast.error("Debes seleccionar el resultado del contacto")
      return false
    }

    // Validaciones de Etapa 2 (si pasa al embudo)
    if (formData.pasa_embudo_ventas) {
      if (!formData.nombre_oportunidad) {
        toast.error("Debes ingresar el nombre de la oportunidad")
        setActiveTab("etapa2")
        return false
      }

      if (!formData.etapa_oportunidad) {
        toast.error("Debes seleccionar la etapa de la oportunidad")
        setActiveTab("etapa2")
        return false
      }

      if (!formData.producto_ofrecido) {
        toast.error("Debes describir el producto/servicio ofrecido")
        setActiveTab("etapa2")
        return false
      }

      if (!formData.monto_total_sin_imp || parseFloat(formData.monto_total_sin_imp) <= 0) {
        toast.error("Debes ingresar un monto válido")
        setActiveTab("etapa2")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!empresa) {
      toast.error("No se pudo identificar la empresa asignada")
      return
    }

    setLoading(true)

    try {
      console.log('📝 Creating trazabilidad with data:', {
        ejecutivaId,
        empresaId: empresa.id_empresa_prov,
        ...formData
      })

      const payload = {
        id_ejecutiva: ejecutivaId,
        id_empresa_prov: empresa.id_empresa_prov.toString(),
        id_cliente_final: formData.id_cliente_final,
        id_contacto: formData.id_contacto,
        tipo_contacto: formData.tipo_contacto,
        fecha_contacto: new Date(formData.fecha_contacto),
        resultado_contacto: formData.resultado_contacto,
        informacion_importante: formData.informacion_importante || undefined,
        reunion_agendada: formData.reunion_agendada,
        fecha_reunion: formData.fecha_reunion ? new Date(formData.fecha_reunion) : undefined,
        participantes: formData.participantes || undefined,
        se_dio_reunion: formData.se_dio_reunion,
        resultados_reunion: formData.resultados_reunion || undefined,
        pasa_embudo_ventas: formData.pasa_embudo_ventas,
        // Campos de Etapa 2 (solo si pasa al embudo)
        nombre_oportunidad: formData.pasa_embudo_ventas ? formData.nombre_oportunidad : undefined,
        etapa_oportunidad: formData.pasa_embudo_ventas ? formData.etapa_oportunidad : undefined,
        producto_ofrecido: formData.pasa_embudo_ventas ? formData.producto_ofrecido : undefined,
        monto_total_sin_imp: formData.pasa_embudo_ventas ? parseFloat(formData.monto_total_sin_imp) : undefined,
        probabilidad_cierre: formData.probabilidad_cierre ? parseInt(formData.probabilidad_cierre) : undefined,
        fecha_cierre_esperado: formData.fecha_cierre_esperado ? new Date(formData.fecha_cierre_esperado) : undefined,
        observaciones: formData.observaciones || undefined
      }

      const result = await ejecutivaService.createTrazabilidad(payload)
      
      console.log('✅ Trazabilidad creada:', result)
      
      toast.success(
        formData.pasa_embudo_ventas 
          ? "Oportunidad creada exitosamente" 
          : "Contacto registrado exitosamente"
      )
      
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      console.error("❌ Error creating trazabilidad:", error)
      toast.error(error.message || "Error al registrar la actividad")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      id_cliente_final: "",
      id_contacto: "",
      tipo_contacto: "",
      fecha_contacto: new Date().toISOString().split('T')[0],
      resultado_contacto: "",
      informacion_importante: "",
      reunion_agendada: false,
      fecha_reunion: "",
      participantes: "",
      se_dio_reunion: false,
      resultados_reunion: "",
      pasa_embudo_ventas: false,
      nombre_oportunidad: "",
      etapa_oportunidad: "",
      producto_ofrecido: "",
      fecha_cierre_esperado: "",
      monto_total_sin_imp: "",
      probabilidad_cierre: "",
      observaciones: ""
    })
    setActiveTab("etapa1")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto !bg-[#013936]/80 border-2 border-[#C7E196]/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 pb-1">
            <Activity className="w-5 h-5 " />
            Registrar Nueva Actividad
          </DialogTitle>
          <DialogDescription className="text-[#b5e385]">
            Registra el contacto con el cliente y, opcionalmente, crea una oportunidad si pasa al embudo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información de Empresa */}
          {empresa && (
            <div className="p-3 bg-[#C7E196]/10 rounded-lg border border-[#C7E196]/30">
              <p className="text-sm text-white font-medium">
                Empresa: <span className="font-bold">{empresa.razon_social}</span>
              </p>
            </div>
          )}

          {/* Selección de Cliente y Contacto */}
          <div className="space-y-4 p-4 bg-[#C7E196]/10 rounded-lg ">
            <h3 className="font-semibold text-white">Cliente y Contacto</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id_cliente_final">Cliente Final *</Label>
                <Select 
                  value={formData.id_cliente_final}
                  onValueChange={(value) => setFormData({ ...formData, id_cliente_final: value, id_contacto: "" })}
                  disabled={loadingClientes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingClientes ? "Cargando..." : "Seleccionar cliente"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#C7E196]">
                    {clientes.length === 0 ? (
                      <SelectItem value="no-clientes" disabled>
                        No hay clientes registrados
                      </SelectItem>
                    ) : (
                      clientes.map((cliente) => (
                        <SelectItem key={cliente.id_cliente_final} value={cliente.id_cliente_final.toString()}>
                          {cliente.razon_social}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_contacto">Persona de Contacto *</Label>
                <Select
                  value={formData.id_contacto}
                  onValueChange={(value) => setFormData({ ...formData, id_contacto: value })}
                  disabled={!formData.id_cliente_final || loadingContactos}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      loadingContactos ? "Cargando..." : 
                      !formData.id_cliente_final ? "Selecciona un cliente primero" :
                      "Seleccionar contacto"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-[#C7E196]">
                    {contactos.length === 0 ? (
                      <SelectItem value="no-contactos" disabled>
                        No hay contactos registrados
                      </SelectItem>
                    ) : (
                      contactos.map((contacto) => (
                        <SelectItem key={contacto.id_contacto} value={contacto.id_contacto.toString()}>
                          {contacto.nombre_completo} {contacto.cargo && `- ${contacto.cargo}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabs para Etapas */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 border border-[#C7E196]/30 ">
              <TabsTrigger value="etapa1">
                <Activity className="w-4 h-4 mr-2" />
                Etapa 1: Contacto
              </TabsTrigger>
              <TabsTrigger value="etapa2" disabled={!formData.pasa_embudo_ventas} className="text-white border border-[#C7E196]/30 ">
                <Target className="w-4 h-4 mr-2" />
                Etapa 2: Oportunidad
              </TabsTrigger>
            </TabsList>

            <TabsContent value="etapa1" className="space-y-4">
              {/* Información del Contacto */}
              <div className="space-y-4 p-4 bg-[#C7E196]/10 rounded-lg ">
                <h3 className="font-semibold text-white">Información del Contacto</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo_contacto">Tipo de Contacto *</Label>
                    <Select
                      value={formData.tipo_contacto}
                      onValueChange={(value) => setFormData({ ...formData, tipo_contacto: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#C7E196]">
                        <SelectItem value="Llamada telefónica">Llamada telefónica</SelectItem>
                        <SelectItem value="Chat de Whatsapp">Chat de Whatsapp</SelectItem>
                        <SelectItem value="Correo electrónico">Correo electrónico</SelectItem>
                        <SelectItem value="Contacto por linkedin">Contacto por LinkedIn</SelectItem>
                        <SelectItem value="Reunión presencial">Reunión presencial</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resultado_contacto">Resultado *</Label>
                    <Select
                      value={formData.resultado_contacto}
                      onValueChange={(value) => setFormData({ ...formData, resultado_contacto: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#C7E196]">
                        <SelectItem value="Positivo">Positivo</SelectItem>
                        <SelectItem value="Negativo">Negativo</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Neutro">Neutro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_contacto">Fecha Contacto *</Label>
                  <Input
                    id="fecha_contacto"
                    type="date"
                    value={formData.fecha_contacto}
                    onChange={(e) => setFormData({ ...formData, fecha_contacto: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="informacion_importante">Información Importante</Label>
                  <Textarea
                    id="informacion_importante"
                    value={formData.informacion_importante}
                    onChange={(e) => setFormData({ ...formData, informacion_importante: e.target.value })}
                    placeholder="Información clave capturada durante el contacto"
                    rows={3}
                  />
                </div>
              </div>

              {/* Reunión */}
              <div className="space-y-4 p-4 bg-[#C7E196]/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reunion_agendada"
                    checked={formData.reunion_agendada}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, reunion_agendada: checked as boolean })
                    }
                  />
                  <Label htmlFor="reunion_agendada" className="cursor-pointer ">
                    ¿Se agendó una reunión?
                  </Label>
                </div>

                {formData.reunion_agendada && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fecha_reunion">Fecha Reunión</Label>
                        <Input
                          id="fecha_reunion"
                          type="date"
                          value={formData.fecha_reunion}
                          onChange={(e) => setFormData({ ...formData, fecha_reunion: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="participantes">Participantes</Label>
                        <Input
                          id="participantes"
                          value={formData.participantes}
                          onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
                          placeholder="Nombres separados por comas"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="se_dio_reunion"
                        checked={formData.se_dio_reunion}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, se_dio_reunion: checked as boolean })
                        }
                      />
                      <Label htmlFor="se_dio_reunion" className="cursor-pointer">
                        ¿La reunión se realizó?
                      </Label>
                    </div>

                    {formData.se_dio_reunion && (
                      <div className="space-y-2">
                        <Label htmlFor="resultados_reunion">Resultados de la Reunión</Label>
                        <Textarea
                          id="resultados_reunion"
                          value={formData.resultados_reunion}
                          onChange={(e) => setFormData({ ...formData, resultados_reunion: e.target.value })}
                          placeholder="Conclusiones y acuerdos de la reunión"
                          rows={3}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Pasa al Embudo */}
              <div className="space-y-4 p-4 bg-[#C7E196]/10 border border-amber-200 rounded-lg text-white">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pasa_embudo_ventas"
                    checked={formData.pasa_embudo_ventas}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, pasa_embudo_ventas: checked as boolean })
                      if (checked) setActiveTab("etapa2")
                    }}
                  />
                  <Label htmlFor="pasa_embudo_ventas" className="cursor-pointer font-semibold text-white">
                    ¿El contacto pasa al embudo de ventas? (Etapa 2)
                  </Label>
                </div>
                <p className="text-sm text-white">
                  Marca esta opción si el contacto mostró interés y deseas crear una oportunidad de venta
                </p>
              </div>
            </TabsContent>

            <TabsContent value="etapa2" className="space-y-4">
              {/* Información de la Oportunidad */}
              <div className="space-y-4 p-4 bg-[#C7E196]/10 rounded-lg">
                <h3 className="font-semibold text-white">Información de la Oportunidad</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="nombre_oportunidad">Nombre de la Oportunidad *</Label>
                  <Input
                    id="nombre_oportunidad"
                    value={formData.nombre_oportunidad}
                    onChange={(e) => setFormData({ ...formData, nombre_oportunidad: e.target.value })}
                    placeholder="Ej: Provisión Ron Cartavio Premium Q1 2025"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="etapa_oportunidad">Etapa Actual *</Label>
                  <Select
                    value={formData.etapa_oportunidad}
                    onValueChange={(value) => setFormData({ ...formData, etapa_oportunidad: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospección">Prospección</SelectItem>
                      <SelectItem value="Calificación">Calificación</SelectItem>
                      <SelectItem value="Detección de necesidades">Detección de necesidades</SelectItem>
                      <SelectItem value="Presentación de solución">Presentación de solución</SelectItem>
                      <SelectItem value="Manejo de objeciones">Manejo de objeciones</SelectItem>
                      <SelectItem value="Presentación de propuesta">Presentación de propuesta</SelectItem>
                      <SelectItem value="Negociación">Negociación</SelectItem>
                      <SelectItem value="Firma de contrato">Firma de contrato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="producto_ofrecido">Producto/Servicio Ofrecido *</Label>
                  <Textarea
                    id="producto_ofrecido"
                    value={formData.producto_ofrecido}
                    onChange={(e) => setFormData({ ...formData, producto_ofrecido: e.target.value })}
                    placeholder="Descripción del producto o servicio"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monto_total_sin_imp">Monto (sin IGV) *</Label>
                    <Input
                      id="monto_total_sin_imp"
                      type="number"
                      step="0.01"
                      value={formData.monto_total_sin_imp}
                      onChange={(e) => setFormData({ ...formData, monto_total_sin_imp: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probabilidad_cierre">Probabilidad (%)</Label>
                    <Input
                      id="probabilidad_cierre"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probabilidad_cierre}
                      onChange={(e) => setFormData({ ...formData, probabilidad_cierre: e.target.value })}
                      placeholder="0-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_cierre_esperado">Cierre Esperado</Label>
                    <Input
                      id="fecha_cierre_esperado"
                      type="date"
                      value={formData.fecha_cierre_esperado}
                      onChange={(e) => setFormData({ ...formData, fecha_cierre_esperado: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    placeholder="Notas adicionales sobre la oportunidad"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}
            className=" !bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !empresa}
              className="bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]"
            >
              {loading ? "Guardando..." : "Guardar Actividad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}