
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
import { UserPlus } from "lucide-react"
import { ejecutivaService } from "@/services/ejecutivaService"

interface AddContactoDialogProps {
  clienteId: number
  ejecutivaId: string // ✅ AGREGAR ejecutivaId
  onSuccess: () => void
  onClose: () => void
  open?: boolean
}

export function AddContactoDialog({ 
  clienteId, 
  ejecutivaId, // ✅ RECIBIR ejecutivaId
  onSuccess, 
  onClose, 
  open = false 
}: AddContactoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    dni: "",
    nombre_completo: "",
    cargo: "",
    correo: "",
    telefono: "",
    linkedin: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("📤 Creando persona de contacto:", {
        ...formData,
        id_cliente_final: clienteId.toString(),
        ejecutivaId: ejecutivaId
      })

      // ✅ LLAMADA REAL AL BACKEND usando el servicio
      await ejecutivaService.createPersonaContacto({
        nombre_completo: formData.nombre_completo,
        cargo: formData.cargo,
        correo: formData.correo,
        telefono: formData.telefono,
        id_cliente_final: clienteId.toString(), // ✅ Convertir a string
        ejecutivaId: ejecutivaId,
        // El servicio maneja automáticamente el DNI y LinkedIn
        dni: formData.dni,
        linkedin: formData.linkedin
      })
      
      console.log("✅ Persona de contacto creada exitosamente")
      
      onSuccess()
      onClose()
      
      // Reset form
      setFormData({
        dni: "",
        nombre_completo: "",
        cargo: "",
        correo: "",
        telefono: "",
        linkedin: "",
      })
    } catch (error) {
      console.error("❌ Error creando persona de contacto:", error)
      alert(error instanceof Error ? error.message : "Error al crear contacto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] !bg-[#013936]/80 border-2 border-[#C7E196]/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 mb-3">
            <UserPlus className="w-5 h-5" />
            Agregar Persona de Contacto
          </DialogTitle>
          <DialogDescription className="pb-2">
            Registra una nueva persona de contacto para este cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 mb-3">
            <Label htmlFor="nombre_completo" className="mb-2">Nombre Completo *</Label>
            <Input
              id="nombre_completo"
              value={formData.nombre_completo}
              onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
              placeholder="Ej: Ana Torres López"
              className="border-[#C7E196]/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni" className="mb-2">DNI</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="12345678"
                className="border-[#C7E196]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo" className="mb-2">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Ej: Jefa de Compras"
                className="border-[#C7E196]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo" className="mb-2">Correo Electrónico</Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              placeholder="ana.torres@cliente.com"
              className="border-[#C7E196]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="mb-2">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="+51987654321"
              className="border-[#C7E196]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="mb-2">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              className="border-[#C7E196]/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} 
            className=" !bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]"

            >
              {loading ? "Guardando..." : "Guardar Contacto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}