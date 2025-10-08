import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const ProductForm: React.FC = () => {
  const { navigate, pageParams } = useNavigation();
  const isEditMode = pageParams.mode === 'edit';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    sku: '',
    status: 'active',
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

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(isEditMode ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      navigate('products');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">
            {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('products')}>
          ← Volver
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre del Producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Laptop Pro X1"
              />
              <Input
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="Ej: LAP-PRO-X1-001"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Software">Software</option>
                  <option value="Servicios">Servicios</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select name="status" value={formData.status} onChange={handleChange} className="input-field" required>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="out_of_stock">Sin Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Describe las características principales del producto..."
              required
            />
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">Precio e Inventario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <Input
                label="Stock Inicial"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">Imágenes</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-gray-600 mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
              <p className="text-sm text-gray-500">PNG, JPG o WEBP (Max. 5MB)</p>
              <input type="file" multiple accept="image/*" className="hidden" />
              <Button variant="outline" size="sm" className="mt-4">
                Seleccionar Archivos
              </Button>
            </div>
          </div>

          {/* Variants (Placeholder) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark">Variantes</h2>
              <Button variant="outline" size="sm" type="button">
                + Agregar Variante
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">No hay variantes configuradas</p>
              <p className="text-sm text-gray-500 mt-1">
                Las variantes te permiten ofrecer diferentes opciones del mismo producto
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6 border-t">
            <Button type="submit" variant="primary" size="lg" loading={loading}>
              {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('products')}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;