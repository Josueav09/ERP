// frontend/src/pages/ejecutiva/ClientesPage.tsx
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Mail, Phone, MapPin, Building2, UserPlus, ChevronDown, ChevronUp, Download, Upload } from "lucide-react"
import { AddClienteDialog } from "../../components/ejecutivaComponents/AddClienteDialog"
import { AddContactoDialog } from "../../components/ejecutivaComponents/AddContactoDialog"
import { ejecutivaService } from "@/services/ejecutivaService"

interface PersonaContacto {
  id_contacto: number
  dni?: string
  nombre_completo: string
  cargo?: string
  correo?: string
  telefono?: string
  linkedin?: string
}

interface ClienteFinal {
  id_cliente_final: number
  ruc?: string
  razon_social: string
  pagina_web?: string
  correo?: string
  telefono?: string
  pais: string
  departamento?: string
  provincia?: string
  direccion?: string
  linkedin?: string
  rubro?: string
  sub_rubro?: string
  tamanio_empresa?: string
  personas_contacto: PersonaContacto[]
  total_actividades: number
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

const navItems = [
  { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
  { label: "Mi Empresa", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
  { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
  { label: "Mi Trazabilidad", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
]

export default function ClientesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<ClienteFinal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCliente, setShowAddCliente] = useState(false)
  const [showAddContacto, setShowAddContacto] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const [expandedCliente, setExpandedCliente] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    fetchClientes()
  }, [user, navigate])

  const fetchClientes = async () => {
    setLoading(true)
    try {
      // ✅ LLAMADA REAL AL BACKEND
      const clientesData = await ejecutivaService.getClientes(user?.id || "")

      // Transformar datos del backend a la interfaz esperada
      const clientesTransformados: ClienteFinal[] = clientesData.map((cliente: any) => ({
        id_cliente_final: cliente.id_cliente_final,
        ruc: cliente.ruc,
        razon_social: cliente.razon_social,
        pagina_web: cliente.pagina_web,
        correo: cliente.correo,
        telefono: cliente.telefono,
        pais: cliente.pais || "Perú",
        departamento: cliente.departamento,
        provincia: cliente.provincia,
        direccion: cliente.direccion,
        linkedin: cliente.linkedin,
        rubro: cliente.rubro,
        sub_rubro: cliente.sub_rubro,
        tamanio_empresa: cliente.tamanio_empresa,
        personas_contacto: cliente.personas_contacto || [],
        total_actividades: cliente.total_actividades || 0,
        contacto_principal: cliente.contacto_principal,
        ultima_actividad: cliente.ultima_actividad
      }))

      setClientes(clientesTransformados)
    } catch (error) {
      console.error("❌ Error fetching clientes:", error)
      // En caso de error, mostrar array vacío
      setClientes([])
    } finally {
      setLoading(false)
    }
  }

  const fetchContactos = async (clienteId: number) => {
    try {
      // ✅ OBTENER CONTACTOS DEL CLIENTE
      const contactos = await ejecutivaService.getContactosCliente(clienteId.toString(), user?.id || "")

      // Actualizar el cliente con sus contactos
      setClientes(prev => prev.map(cliente =>
        cliente.id_cliente_final === clienteId
          ? { ...cliente, personas_contacto: contactos }
          : cliente
      ))
    } catch (error) {
      console.error("❌ Error fetching contactos:", error)
    }
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.ruc?.includes(searchTerm) ||
    cliente.rubro?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClienteCreated = () => {
    fetchClientes()
    setShowAddCliente(false)
  }

  const handleContactoCreated = () => {
    // Refrescar los contactos del cliente específico
    if (selectedClienteId) {
      fetchContactos(selectedClienteId)
    }
    setShowAddContacto(false)
    setSelectedClienteId(null)
  }

  const handleAddContacto = (clienteId: number) => {
    setSelectedClienteId(clienteId)
    setShowAddContacto(true)
  }

  const toggleExpand = async (clienteId: number) => {
    if (expandedCliente === clienteId) {
      setExpandedCliente(null)
    } else {
      // Si el cliente no tiene contactos cargados, cargarlos
      const cliente = clientes.find(c => c.id_cliente_final === clienteId)
      if (cliente && cliente.personas_contacto.length === 0) {
        await fetchContactos(clienteId)
      }
      setExpandedCliente(clienteId)
    }
  }

  /**
   * ✅ NUEVO: Manejar subida de archivo CSV
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user?.id) return

    // Validar que sea CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Por favor, sube un archivo CSV')
      return
    }

    setUploading(true)
    try {
      const result = await ejecutivaService.bulkCreateClientes(file, user.id)

      // Mostrar resultados
      alert(`
        📊 Resultado del proceso:
        • Total registros: ${result.total}
        • Creados exitosamente: ${result.creados}
        • Duplicados en archivo: ${result.duplicados_en_archivo}
        • Registros inválidos: ${result.invalidos}
      `)

      // Refrescar la lista de clientes
      if (result.creados > 0) {
        fetchClientes()
      }

    } catch (error: any) {
      console.error('Error en bulk upload:', error)
      alert(`Error al procesar archivo: ${error.response?.data?.message || error.message}`)
    } finally {
      setUploading(false)
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  /**
   * ✅ NUEVO: Descargar plantilla
   */
  const handleDownloadTemplate = async () => {
    if (!user?.id) return

    try {
      await ejecutivaService.downloadPlantillaClientes(user.id)
    } catch (error: any) {
      console.error('Error descargando plantilla:', error)
      alert('Error al descargar plantilla')
    }
  }



  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Clientes finales de tu empresa">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Cargando clientes...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Clientes finales de tu empresa">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Mis Clientes</h2>
            <p className="text-white/60">Gestiona los clientes finales de tu empresa proveedora</p>
          </div>

          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936] font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Plantilla
          </Button>

          {/* ✅ NUEVO: Botón Subir CSV */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936] font-semibold"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Subiendo...' : 'Subir CSV'}
          </Button>

          {/* Input oculto para subir archivo */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />

          {/* Botón existente: Nuevo Cliente */}
          <Button
            onClick={() => setShowAddCliente(true)}
            className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>

        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <Input
            placeholder="Buscar clientes por nombre, RUT o rubro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Total Clientes</p>
            <p className="text-2xl font-bold text-white">{clientes.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Personas de Contacto</p>
            <p className="text-2xl font-bold text-white">
              {clientes.reduce((sum, cli) => sum + cli.personas_contacto.length, 0)}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Actividades Totales</p>
            <p className="text-2xl font-bold text-white">
              {clientes.reduce((sum, cli) => sum + cli.total_actividades, 0)}
            </p>
          </Card>
        </div>

        {/* Clientes Cards */}
        <div className="space-y-4">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id_cliente_final} className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
              {/* Cliente header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                      <Building2 className="w-6 h-6 text-[#C7E196]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{cliente.razon_social}</h3>
                      <p className="text-white/60 text-sm mt-1">RUC: {cliente.ruc || "No especificado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#C7E196]/20 text-[#white]/90 border border-[#C7E196]/30">
                      {cliente.tamanio_empresa || "N/A"}
                    </Badge>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    {cliente.correo && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Mail className="w-4 h-4" />
                        <span>{cliente.correo}</span>
                      </div>
                    )}
                    {cliente.telefono && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Phone className="w-4 h-4" />
                        <span>{cliente.telefono}</span>
                      </div>
                    )}
                    {cliente.direccion && (
                      <div className="flex items-start gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{cliente.direccion}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-white/60">Rubro: </span>
                      <span className="text-white">{cliente.rubro || "No especificado"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Sub-rubro: </span>
                      <span className="text-white">{cliente.sub_rubro || "No especificado"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Ubicación: </span>
                      <span className="text-white">
                        {[cliente.provincia, cliente.departamento].filter(Boolean).join(", ") || "No especificada"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C7E196]" />
                      <span className="text-sm text-white/60">
                        {cliente.personas_contacto.length} {cliente.personas_contacto.length === 1 ? 'contacto' : 'contactos'}
                      </span>
                    </div>
                    <div className="text-sm text-white/60">
                      {cliente.total_actividades} actividades
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddContacto(cliente.id_cliente_final)}
                      className=" !bg-[#C7E196]  border-[#C7E196]/30 text-[#012826] hover:bg-[#C7E196]/10"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Contacto
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(cliente.id_cliente_final)}
                      className="!bg-[#C7E196]  border-[#C7E196]/30 text-[#012826] hover:bg-[#C7E196]/10"
                    >
                      {expandedCliente === cliente.id_cliente_final ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Ocultar Contactos
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Ver Contactos
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Personas de contacto expandible */}
              {expandedCliente === cliente.id_cliente_final && cliente.personas_contacto.length > 0 && (
                <div className="border-t border-white/10 !bg-[#C7E196]/5 p-6">
                  <h4 className="text-sm font-semibold text-white mb-1">Personas de Contacto</h4>
                  <div className="grid md:grid-cols-2 gap-4 ">
                    {cliente.personas_contacto.map((contacto) => (
                      <Card key={contacto.id_contacto} className="bg-[#013936]/80 border-[#C7E196]/10 p-4">
                        <div className="flex items-start justify-between mb-0">
                          <div>
                            <h5 className="font-semibold text-white">{contacto.nombre_completo}</h5>
                            {contacto.cargo && (
                              <p className="text-sm text-white/60 mt-1">{contacto.cargo}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {contacto.correo && (
                            <div className="flex items-center gap-2 text-sm mt-0">
                              <Mail className="w-3 h-3 text-[#C7E196]" />
                              <span className="text-white/80">{contacto.correo}</span>
                            </div>
                          )}
                          {contacto.telefono && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-[#C7E196]" />
                              <span className="text-white/80">{contacto.telefono}</span>
                            </div>
                          )}
                          {contacto.linkedin && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-3 h-3 text-[#C7E196]" />
                              <a
                                href={contacto.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#C7E196] hover:underline"
                              >
                                LinkedIn
                              </a>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado sin contactos */}
              {expandedCliente === cliente.id_cliente_final && cliente.personas_contacto.length === 0 && (
                <div className="border-t border-white/10 bg-white/5 p-6">
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60 mb-4">No hay personas de contacto registradas</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddContacto(cliente.id_cliente_final)}
                      className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Primera Persona
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Estado vacío */}
        {filteredClientes.length === 0 && (
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-12 text-center">
            <Building2 className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No se encontraron clientes</h3>
            <p className="text-white/60 mb-6">
              {searchTerm
                ? "No hay clientes que coincidan con tu búsqueda"
                : "Aún no tienes clientes registrados"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowAddCliente(true)}
                className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primer Cliente
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Dialogs */}
      {showAddCliente && (
        <AddClienteDialog
          open={showAddCliente}
          ejecutivaId={user?.id || ""}
          onSuccess={handleClienteCreated}
          onClose={() => setShowAddCliente(false)}
        />
      )}

      {showAddContacto && selectedClienteId && (
        <AddContactoDialog
          open={showAddContacto}
          clienteId={selectedClienteId}
          ejecutivaId={user?.id || ""}
          onSuccess={handleContactoCreated}
          onClose={() => {
            setShowAddContacto(false)
            setSelectedClienteId(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}