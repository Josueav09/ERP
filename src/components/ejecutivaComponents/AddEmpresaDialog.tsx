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
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch('/api/ejecutiva/empresas/registrar', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     id_ejecutiva_registro: ejecutivaId,
      //     estado: 'Pendiente'
      //   })
      // })
      
      console.log("Registrando empresa:", {
        ...formData,
        id_ejecutiva_registro: ejecutivaId,
        estado: 'Pendiente'
      })
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
      console.error("Error registrando empresa:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#013936] flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Registrar Nueva Empresa Proveedora
          </DialogTitle>
          <DialogDescription>
            La empresa quedará en estado <strong>Pendiente</strong> hasta que un Jefe/Administrador la apruebe y asigne.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            Esta empresa NO será asignada automáticamente a ti. El Jefe/Admin decidirá qué ejecutiva la gestionará.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información básica */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-[#013936]">Información Básica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC *</Label>
                <Input
                  id="ruc"
                  value={formData.ruc}
                  onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                  placeholder="20612945528"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="razon_social">Razón Social *</Label>
                <Input
                  id="razon_social"
                  value={formData.razon_social}
                  onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo Corporativo *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="contacto@empresa.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña">Contraseña de Acceso *</Label>
              <Input
                id="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                placeholder="Contraseña para el portal"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+51987654321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagina_web">Página Web</Label>
                <Input
                  id="pagina_web"
                  value={formData.pagina_web}
                  onChange={(e) => setFormData({ ...formData, pagina_web: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-[#013936]">Ubicación</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
          </div>

          {/* Información comercial */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-[#013936]">Información Comercial</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rubro">Rubro</Label>
                <Input
                  id="rubro"
                  value={formData.rubro}
                  onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                  placeholder="Ej: Bebidas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub_rubro">Sub-rubro</Label>
                <Input
                  id="sub_rubro"
                  value={formData.sub_rubro}
                  onChange={(e) => setFormData({ ...formData, sub_rubro: e.target.value })}
                  placeholder="Ej: Destilados"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tamanio_empresa">Tamaño</Label>
                <Select
                  value={formData.tamanio_empresa}
                  onValueChange={(value) => setFormData({ ...formData, tamanio_empresa: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pequeña">Pequeña</SelectItem>
                    <SelectItem value="Mediana">Mediana</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad_empleados">N° Empleados</Label>
                <Input
                  id="cantidad_empleados"
                  type="number"
                  value={formData.cantidad_empleados}
                  onChange={(e) => setFormData({ ...formData, cantidad_empleados: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facturacion_anual">Facturación Anual</Label>
                <Input
                  id="facturacion_anual"
                  type="number"
                  value={formData.facturacion_anual}
                  onChange={(e) => setFormData({ ...formData, facturacion_anual: e.target.value })}
                  placeholder="USD"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grupo_economico">Grupo Económico</Label>
                <Input
                  id="grupo_economico"
                  value={formData.grupo_economico}
                  onChange={(e) => setFormData({ ...formData, grupo_economico: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#013936] hover:bg-[#013936]/90"
            >
              {loading ? "Registrando..." : "Registrar Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}