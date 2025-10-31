// frontend/src/components/ejecutivaComponents/AddEmpresaDialog.tsx
import React, { useState } from "react"
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
import { Building2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ejecutivaService } from "@/services/ejecutivaService"

interface AddEmpresaDialogProps {
  ejecutivaId: string
  onSuccess: () => void
  onClose: () => void
  open?: boolean
}

export function AddEmpresaDialog({ ejecutivaId, onSuccess, onClose, open = false }: AddEmpresaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ruc: "",
    razon_social: "",
    pagina_web: "",
    correo: "",
    contraseña: "",
    telefono: "",
    pais: "Perú",
    departamento: "",
    provincia: "",
    direccion: "",
    linkedin: "",
    grupo_economico: "",
    rubro: "",
    sub_rubro: "",
    tamanio_empresa: "",
    facturacion_anual: "",
    cantidad_empleados: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {

      // ✅ LLAMADA REAL AL BACKEND usando el servicio
      await ejecutivaService.createEmpresa({
        razon_social: formData.razon_social,
        ruc: formData.ruc,
        direccion: formData.direccion,
        telefono: formData.telefono,
        correo: formData.correo,
        ejecutivaId: ejecutivaId,
        // ✅ AGREGAR TODOS LOS CAMPOS ADICIONALES
        contraseña: formData.contraseña,
        pagina_web: formData.pagina_web,
        pais: formData.pais,
        departamento: formData.departamento,
        provincia: formData.provincia,
        linkedin: formData.linkedin,
        grupo_economico: formData.grupo_economico,
        rubro: formData.rubro,
        sub_rubro: formData.sub_rubro,
        tamanio_empresa: formData.tamanio_empresa,
        facturacion_anual: formData.facturacion_anual,
        cantidad_empleados: formData.cantidad_empleados
      })
      
      
      onSuccess()
      onClose()
      
      // Reset form
      setFormData({
        ruc: "",
        razon_social: "",
        pagina_web: "",
        correo: "",
        contraseña: "",
        telefono: "",
        pais: "Perú",
        departamento: "",
        provincia: "",
        direccion: "",
        linkedin: "",
        grupo_economico: "",
        rubro: "",
        sub_rubro: "",
        tamanio_empresa: "",
        facturacion_anual: "",
        cantidad_empleados: "",
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al registrar empresa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto !bg-[#013936]/80 border-2 border-[#C7E196]/20 text-white">
        <DialogHeader className="border-b border-[#C7E196]/20 pb-4">
          <DialogTitle className="text-white flex items-center gap-2 text-xl font-bold">
            <Building2 className="w-6 h-6" />
            Registrar Nueva Empresa Proveedora
          </DialogTitle>
          <DialogDescription className="text-[#C7E196] mt-2">
            La empresa quedará en estado <span className="font-semibold text-white">Pendiente</span> hasta que un Jefe/Administrador la apruebe y asigne.
          </DialogDescription>
        </DialogHeader>

        <Alert className="!bg-[#C7E196]/20 border-[#C7E196] text-white">
          <AlertCircle className="h-4 w-4 text-[#013936]" />
          <AlertDescription className="text-white text-sm font-medium">
            Esta empresa NO será asignada automáticamente a ti. El Jefe/Admin decidirá qué ejecutiva la gestionará.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Información básica */}
          <div className="space-y-4 p-6 bg-[#013936] rounded-lg border-2 border-[#C7E196]/20">
            <h3 className="font-bold text-[#C7E196] text-lg border-b border-[#C7E196]/20 pb-2">Información Básica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ruc" className="text-sm font-bold text-white">RUC *</Label>
                <Input
                  id="ruc"
                  value={formData.ruc}
                  onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                  placeholder="20612945528"
                  required
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="razon_social" className="text-sm font-bold text-white">Razón Social *</Label>
                <Input
                  id="razon_social"
                  value={formData.razon_social}
                  onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                  placeholder="Ej: Ron Cartavio S.A."
                  required
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo" className="text-sm font-bold text-white">Correo Corporativo *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="contacto@empresa.com"
                required
                className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña" className="text-sm font-bold text-white">Contraseña de Acceso *</Label>
              <Input
                id="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                placeholder="Contraseña para el portal"
                required
                className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-bold text-white">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+51987654321"
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagina_web" className="text-sm font-bold text-white">Página Web</Label>
                <Input
                  id="pagina_web"
                  value={formData.pagina_web}
                  onChange={(e) => setFormData({ ...formData, pagina_web: e.target.value })}
                  placeholder="https://..."
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-4 p-6 bg-[#013936] rounded-lg border-2 border-[#C7E196]/20">
            <h3 className="font-bold text-[#C7E196] text-lg border-b border-[#C7E196]/20 pb-2">Ubicación</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pais" className="text-sm font-bold text-white">País</Label>
                <Input
                  id="pais"
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  className="border-1 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento" className="text-sm font-bold text-white">Departamento</Label>
                <Input
                  id="departamento"
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-sm font-bold text-white">Provincia</Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-sm font-bold text-white">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Av. Principal 123"
                className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
              />
            </div>
          </div>

          {/* Información comercial */}
          <div className="space-y-4 p-6 bg-[#013936] rounded-lg border-2 border-[#C7E196]/20">
            <h3 className="font-bold text-[#C7E196] text-lg border-b border-[#C7E196]/20 pb-2">Información Comercial</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rubro" className="text-sm font-bold text-white">Rubro</Label>
                <Input
                  id="rubro"
                  value={formData.rubro}
                  onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                  placeholder="Ej: Bebidas"
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub_rubro" className="text-sm font-bold text-white">Sub-rubro</Label>
                <Input
                  id="sub_rubro"
                  value={formData.sub_rubro}
                  onChange={(e) => setFormData({ ...formData, sub_rubro: e.target.value })}
                  placeholder="Ej: Destilados"
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tamanio_empresa" className="text-sm font-bold text-white">Tamaño</Label>
                <Select
                  value={formData.tamanio_empresa}
                  onValueChange={(value) => setFormData({ ...formData, tamanio_empresa: value })}
                >
                  <SelectTrigger className="border-2 border-[#C7E196]/20 bg-[#013936] text-white focus:border-white focus:ring-white">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#013936] border-2 border-[#C7E196]/20 text-white">
                    <SelectItem value="Pequeña" className="focus:bg-[#C7E196] focus:text-[#013936]">Pequeña</SelectItem>
                    <SelectItem value="Mediana" className="focus:bg-[#C7E196] focus:text-[#013936]">Mediana</SelectItem>
                    <SelectItem value="Grande" className="focus:bg-[#C7E196] focus:text-[#013936]">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad_empleados" className="text-sm font-bold text-white">N° Empleados</Label>
                <Input
                  id="cantidad_empleados"
                  type="number"
                  value={formData.cantidad_empleados}
                  onChange={(e) => setFormData({ ...formData, cantidad_empleados: e.target.value })}
                  placeholder="0"
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facturacion_anual" className="text-sm font-bold text-white">Facturación Anual</Label>
                <Input
                  id="facturacion_anual"
                  type="number"
                  value={formData.facturacion_anual}
                  onChange={(e) => setFormData({ ...formData, facturacion_anual: e.target.value })}
                  placeholder="USD"
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grupo_economico" className="text-sm font-bold text-white">Grupo Económico</Label>
                <Input
                  id="grupo_economico"
                  value={formData.grupo_economico}
                  onChange={(e) => setFormData({ ...formData, grupo_economico: e.target.value })}
                  placeholder="Ej: Grupo Romero"
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-bold text-white">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                  className="border-2 border-[#C7E196]/20 bg-[#013936] text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#C7E196]/20">
            <Button 
              type="button" 
              onClick={onClose}
              className="bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]"
            >
              {loading ? "Registrando..." : "Registrar Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}