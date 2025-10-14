// frontend/src/modules/ejecutiva/components/AddClienteDialog.tsx
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
import { Users } from "lucide-react"
import { ejecutivaService, type Empresa } from "@/services/ejecutivaService"

interface AddClienteDialogProps {
  ejecutivaId: string
  onSuccess: () => void
  onClose: () => void
  open?: boolean
}

export function AddClienteDialog({ ejecutivaId, onSuccess, onClose, open = false }: AddClienteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [formData, setFormData] = useState({
    id_empresa: "",
    nombre_cliente: "",
    rut_cliente: "",
    direccion: "",
    telefono: "",
    email: "",
  })

  useEffect(() => {
    if (open) {
      fetchEmpresas()
    }
  }, [open])

  const fetchEmpresas = async () => {
    try {
      const empresasData = await ejecutivaService.getEmpresas(ejecutivaId)
      setEmpresas(empresasData)
    } catch (error) {
      console.error("[v1] Error fetching empresas:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await ejecutivaService.createCliente({ ...formData, id_ejecutiva: ejecutivaId })
      onClose()
      setFormData({
        id_empresa: "",
        nombre_cliente: "",
        rut_cliente: "",
        direccion: "",
        telefono: "",
        email: "",
      })
      onSuccess()
    } catch (error) {
      console.error("[v1] Error creating cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#013936]">Registrar Nuevo Cliente</DialogTitle>
          <DialogDescription>El cliente debe estar asociado a una empresa existente</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id_empresa">Empresa</Label>
            <Select
              value={formData.id_empresa}
              onValueChange={(value) => setFormData({ ...formData, id_empresa: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
                    {empresa.nombre_empresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre_cliente">Nombre del Cliente</Label>
            <Input
              id="nombre_cliente"
              value={formData.nombre_cliente}
              onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rut_cliente">RUT</Label>
            <Input
              id="rut_cliente"
              value={formData.rut_cliente}
              onChange={(e) => setFormData({ ...formData, rut_cliente: e.target.value })}
              placeholder="79.456.789-0"
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.id_empresa}
              className="bg-[#013936] hover:bg-[#013936]/90"
            >
              {loading ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}