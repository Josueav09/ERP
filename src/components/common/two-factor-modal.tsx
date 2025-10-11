import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2 } from "lucide-react"

interface TwoFactorModalProps {
  open: boolean
  onVerify: (code: string) => Promise<{ success: boolean; error?: string }>
  onClose: () => void
}

export function TwoFactorModal({ open, onVerify, onClose }: TwoFactorModalProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await onVerify(code)
      if (!result.success) {
        setError(result.error || "Código inválido")
        setCode("")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C7E196]/20">
            <Shield className="h-8 w-8 text-[#013936]" />
          </div>
          <DialogTitle className="text-center text-2xl">Verificación en dos pasos</DialogTitle>
          <DialogDescription className="text-center">
            Ingrese el código de 6 dígitos de su aplicación de autenticación
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código de verificación</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="text-center text-2xl tracking-widest border-[#013936]/20 focus-visible:ring-[#C7E196]"
              maxLength={6}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#013936]/20 bg-transparent"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar"
              )}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Demo: Use el código <span className="font-mono font-semibold">123456</span>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
