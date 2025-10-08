import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const LeadForm: React.FC = () => {
  const { navigate, pageParams } = useNavigation();
  const isEditMode = pageParams.mode === 'edit';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    temperature: 'warm',
    source: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert(isEditMode ? 'Lead actualizado exitosamente' : 'Lead creado exitosamente');
      navigate('marketing');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">
            {isEditMode ? 'Editar Lead' : 'Nuevo Lead'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Actualiza la información del lead' : 'Registra un nuevo lead en el sistema'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('marketing')}>
          ← Volver
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">Información del Lead</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Juan Pérez" />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="juan@empresa.com" />
              <Input label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+51 987 654 321" />
              <Input label="Empresa" name="company" value={formData.company} onChange={handleChange} required placeholder="Tech Corp SAC" />
              <Input label="Cargo" name="position" value={formData.position} onChange={handleChange} placeholder="Gerente de Compras" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura <span className="text-red-500">*</span>
                </label>
                <select name="temperature" value={formData.temperature} onChange={handleChange} className="input-field" required>
                  <option value="hot">🔥 Hot (Alta prioridad)</option>
                  <option value="warm">☀️ Warm (Media prioridad)</option>
                  <option value="cold">❄️ Cold (Baja prioridad)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuente del Lead <span className="text-red-500">*</span>
            </label>
            <select name="source" value={formData.source} onChange={handleChange} className="input-field" required>
              <option value="">Seleccionar fuente</option>
              <option value="evento">📅 Evento</option>
              <option value="referido">👥 Referido</option>
              <option value="linkedin">💼 LinkedIn</option>
              <option value="redes_sociales">📱 Redes Sociales</option>
              <option value="web">🌐 Sitio Web</option>
              <option value="llamada">📞 Llamada Entrante</option>
              <option value="email">✉️ Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Información adicional sobre el lead..."
            />
          </div>

          <div className="flex space-x-4 pt-6 border-t">
            <Button type="submit" variant="primary" size="lg" loading={loading}>
              {isEditMode ? 'Actualizar Lead' : 'Crear Lead'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('marketing')}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;