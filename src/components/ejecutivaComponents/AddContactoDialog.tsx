// frontend/src/components/ejecutivaComponents/AddContactoDialog.tsx
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

interface AddContactoDialogProps {
  clienteId: number
  onSuccess: () => void
  onClose: () => void
  open?: boolean
}

export function AddContactoDialog({ clienteId, onSuccess, onClose, open = false }: AddContactoDialogProps) {
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
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch(`/api/clientes/${clienteId}/contactos`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      console.log("Creando persona de contacto:", {
        ...formData,
        id_cliente_final: clienteId
      })
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
      console.error("Error creando persona de contacto:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#013936] flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Agregar Persona de Contacto
          </DialogTitle>
          <DialogDescription>
            Registra una nueva persona de contacto para este cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_completo">Nombre Completo *</Label>
            <Input
              id="nombre_completo"
              value={formData.nombre_completo}
              onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
              placeholder="Ej: Ana Torres López"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="12345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Ej: Jefa de Compras"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              placeholder="ana.torres@cliente.com"
            />
          </div>

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
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
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
              {loading ? "Guardando..." : "Guardar Contacto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}