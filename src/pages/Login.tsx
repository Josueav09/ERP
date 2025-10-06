import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code2FA, setCode2FA] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (attempts >= 7) {
      setError('Usuario bloqueado por múltiples intentos fallidos');
      return;
    }

    if (captcha.toLowerCase() !== 'erp') {
      setError('Captcha incorrecto');
      return;
    }

    try {
      const res = await login(email, password, code2FA, captcha);
      if (res.success) {
        navigate('/', { replace: true });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(res.message || 'Credenciales inválidas.');
      }
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(err?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A332C] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#0A332C] mb-6 text-center">Acceso al Sistema ERP</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#B5E385] focus:border-transparent"
              placeholder="usuario@empresa.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#B5E385] focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Código 2FA</label>
            <input
              type="text"
              value={code2FA}
              onChange={(e) => setCode2FA(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#B5E385] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Captcha (escribe "erp")</label>
            <input
              type="text"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              placeholder="Verificación"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#B5E385] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E4640] text-[#B5E385] py-3 rounded font-semibold hover:bg-[#0A332C] transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
          <p>🔒 Sistema con autenticación 2FA</p>
          <p>⏱️ Sesión expira en 10 minutos de inactividad</p>
          <p>🚫 Bloqueo tras 7 intentos fallidos</p>
          <p className="text-xs text-gray-500 mt-4">Tip: Usa cualquier email/password para demo</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
