import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../context/NavigationContext';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { SECURITY } from '../config/config';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code2FA, setCode2FA] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { navigate } = useNavigation();

  const MAX_ATTEMPTS = SECURITY.maxIPAttempts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar intentos
    if (attempts >= MAX_ATTEMPTS) {
      setError('Usuario bloqueado por múltiples intentos fallidos. Contacte al administrador.');
      return;
    }

    // Validar captcha
    if (captcha.toLowerCase() !== 'erp') {
      setError('Captcha incorrecto. Por favor, escriba "erp"');
      return;
    }

    // Validar campos
    if (!email || !password || !code2FA) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password, code2FA, captcha });
      navigate('dashboard');
    } catch (err: any) {
      setAttempts((prev) => prev + 1);
      setError(
        err.message || `Credenciales inválidas. Intentos restantes: ${MAX_ATTEMPTS - attempts - 1}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-2xl p-8 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-dark text-accent p-4 rounded-full mb-4">
            <svg
              className="w-12 h-12"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary-dark mb-2">Sistema ERP</h2>
          <p className="text-gray-600">Ingrese sus credenciales para continuar</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            label="Correo Electrónico"
            placeholder="usuario@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={attempts >= MAX_ATTEMPTS}
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            }
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={attempts >= MAX_ATTEMPTS}
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            }
          />

          <Input
            type="text"
            label="Código 2FA"
            placeholder="123456"
            value={code2FA}
            onChange={(e) => setCode2FA(e.target.value)}
            required
            maxLength={6}
            disabled={attempts >= MAX_ATTEMPTS}
            helperText="Ingrese el código de autenticación de dos factores"
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            }
          />

          <Input
            type="text"
            label='Captcha - Escriba "erp"'
            placeholder="Verificación"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            required
            disabled={attempts >= MAX_ATTEMPTS}
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={attempts >= MAX_ATTEMPTS}
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Additional info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <span>🔒</span>
              <span>Autenticación 2FA</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>⏱️</span>
              <span>Sesión de 10 min</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🚫</span>
              <span>Bloqueo tras 7 intentos</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🌐</span>
              <span>Bloqueo por IP (5)</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              💡 <strong>Modo Demo:</strong> Usa cualquier email y contraseña para probar
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;