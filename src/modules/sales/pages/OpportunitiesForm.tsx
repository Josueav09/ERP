import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const OpportunityForm: React.FC = () => {
  const { navigate, pageParams } = useNavigation();
  const isEditMode = pageParams.mode === 'edit';

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    company: '',
    contactPerson: '',
    value: '',
    stage: 'prospecting',
    probability: '50',
    expectedCloseDate: '',
    description: '',
    source: '',
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
      alert(isEditMode ? 'Oportunidad actualizada exitosamente' : 'Oportunidad creada exitosamente');
      navigate('sales');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">
            {isEditMode ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Actualiza los datos de la oportunidad' : 'Registra una nueva oportunidad de venta'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('sales')}>
          ← Volver
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">Información del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nombre del Cliente" name="clientName" value={formData.clientName} onChange={handleChange} required placeholder="Juan Pérez" />
              <Input label="Email" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} required placeholder="juan@empresa.com" />
              <Input label="Teléfono" name="clientPhone" type="tel" value={formData.clientPhone} onChange={handleChange} required placeholder="+51 987 654 321" />
              <Input label="Empresa" name="company" value={formData.company} onChange={handleChange} required placeholder="Tech Corp SAC" />
              <Input label="Persona de Contacto" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required placeholder="María González" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuente <span className="text-red-500">*</span>
                </label>
                <select name="source" value={formData.source} onChange={handleChange} className="input-field" required>
                  <option value="">Seleccionar fuente</option>
                  <option value="lead_conversion">Conversión de Lead</option>
                  <option value="referral">Referido</option>
                  <option value="cold_call">Llamada en Frío</option>
                  <option value="inbound">Marketing Entrante</option>
                  <option value="partner">Socio Comercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Opportunity Details */}
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">Detalles de la Oportunidad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Valor Estimado (USD)"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                required
                placeholder="50000"
                icon={<span className="text-gray-400">$</span>}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etapa <span className="text-red-500">*</span>
                </label>
                <select name="stage" value={formData.stage} onChange={handleChange} className="input-field" required>
                  <option value="prospecting">Prospección</option>
                  <option value="qualification">Calificación</option>
                  <option value="proposal">Propuesta</option>
                  <option value="negotiation">Negociación</option>
                  <option value="closing">Cierre</option>
                </select>
              </div>
              <div>
                <Input
                  label="Probabilidad de Cierre (%)"
                  name="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={handleChange}
                  required
                />
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${formData.probability}%` }}
                  />
                </div>
              </div>
              <Input
                label="Fecha Estimada de Cierre"
                name="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la Oportunidad <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="input-field"
              placeholder="Describe los detalles de la oportunidad, necesidades del cliente, solución propuesta..."
              required
            />
          </div>

          {/* Products (Placeholder) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark">Productos/Servicios</h2>
              <Button variant="outline" size="sm" type="button">
                + Agregar Producto
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">No hay productos agregados</p>
              <p className="text-sm text-gray-500 mt-1">
                Agrega los productos o servicios incluidos en esta oportunidad
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6 border-t">
            <Button type="submit" variant="primary" size="lg" loading={loading}>
              {isEditMode ? 'Actualizar Oportunidad' : 'Crear Oportunidad'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('sales')}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;