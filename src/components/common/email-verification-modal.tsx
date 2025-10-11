import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react"

interface EmailVerificationModalProps {
  open: boolean
  email: string
  onVerify: (code: string) => Promise<{ success: boolean; error?: string }>
  onClose: () => void
}

export function EmailVerificationModal({ open, email, onVerify, onClose }: EmailVerificationModalProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (code.length !== 6) {
      setError("El código debe tener 6 dígitos")
      return
    }

    setIsLoading(true)

    try {
      const result = await onVerify(code)
      if (!result.success) {
        setError(result.error || "Código inválido")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    setError("")
    alert("Nuevo código enviado a su correo electrónico")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C7E196]/20">
              <Mail className="h-6 w-6 text-[#013936]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#013936]">Verificación de Correo</h2>
              <p className="text-sm text-gray-600 mt-1">
                Ingresa el código de 6 dígitos
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hemos enviado un código de verificación a:
            </p>
            <p className="text-sm font-semibold text-[#013936] mt-1">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="verification-code" className="text-[#013936] font-medium">
                Código de Verificación
              </Label>
              <Input
                id="verification-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl font-mono tracking-widest h-14 border-gray-300 focus:border-[#C7E196] focus:ring-[#C7E196]"
                autoFocus
                required
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <CheckCircle2 className="h-4 w-4 text-[#C7E196]" />
              <span>El código expira en 10 minutos</span>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-semibold text-base transition-colors"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Código"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-[#013936] hover:text-[#013936]/80 font-medium underline-offset-4 hover:underline transition-colors"
            >
              ¿No recibió el código? Reenviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}