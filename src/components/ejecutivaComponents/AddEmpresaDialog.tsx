// frontend/src/modules/ejecutiva/components/AddEmpresaDialog.tsx
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
import { Building2 } from "lucide-react"
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
    nombre_empresa: "",
    rut: "",
    direccion: "",
    telefono: "",
    email_contacto: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await ejecutivaService.createEmpresa({ ...formData, ejecutivaId })
      onClose()
      setFormData({
        nombre_empresa: "",
        rut: "",
        direccion: "",
        telefono: "",
        email_contacto: "",
      })
      onSuccess()
    } catch (error) {
      console.error("[v1] Error creating empresa:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#013936]">Registrar Nueva Empresa</DialogTitle>
          <DialogDescription>Ingresa los datos de la empresa proveedora</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_empresa">Nombre de la Empresa</Label>
            <Input
              id="nombre_empresa"
              value={formData.nombre_empresa}
              onChange={(e) => setFormData({ ...formData, nombre_empresa: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rut">RUT</Label>
            <Input
              id="rut"
              value={formData.rut}
              onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
              placeholder="76.123.456-7"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+56912345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_contacto">Email</Label>
              <Input
                id="email_contacto"
                type="email"
                value={formData.email_contacto}
                onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#013936] hover:bg-[#013936]/90">
              {loading ? "Guardando..." : "Guardar Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}