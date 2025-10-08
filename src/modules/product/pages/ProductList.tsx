import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'active' | 'inactive' | 'out_of_stock';
}

const ProductList: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const products: Product[] = [
    { id: '1', name: 'Laptop Pro X1', category: 'Electrónica', price: 1299, stock: 45, image: '💻', status: 'active' },
    { id: '2', name: 'Smartphone Z9', category: 'Electrónica', price: 899, stock: 120, image: '📱', status: 'active' },
    { id: '3', name: 'Auriculares Premium', category: 'Electrónica', price: 249, stock: 78, image: '🎧', status: 'active' },
    { id: '4', name: 'Tablet Elite', category: 'Electrónica', price: 599, stock: 0, image: '📱', status: 'out_of_stock' },
    { id: '5', name: 'Monitor 4K 27"', category: 'Electrónica', price: 449, stock: 56, image: '🖥️', status: 'active' },
    { id: '6', name: 'Teclado Mecánico', category: 'Accesorios', price: 149, stock: 92, image: '⌨️', status: 'active' },
  ];

  const categories = ['all', 'Electrónica', 'Accesorios', 'Software', 'Servicios'];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge-success">Activo</span>;
      case 'inactive':
        return <span className="badge-warning">Inactivo</span>;
      case 'out_of_stock':
        return <span className="badge-danger">Sin Stock</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">Administra tu catálogo de productos</p>
        </div>
        <Button variant="primary" onClick={() => navigate('product-form', { mode: 'create' })}>
          + Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas las categorías' : cat}
              </option>
            ))}
          </select>
          <Button variant="secondary">Aplicar Filtros</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Productos</p>
          <p className="text-2xl font-bold text-primary-dark">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">En Stock</p>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 0).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Sin Stock</p>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Valor Total</p>
          <p className="text-2xl font-bold text-primary-dark">
            ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card p-6 animate-fadeIn">
            <div className="text-6xl text-center mb-4">{product.image}</div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{product.category}</p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              <div className="text-right">
                <p className="text-sm text-gray-500">Stock</p>
                <p className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock}
                </p>
              </div>
            </div>

            <div className="mb-4">
              {getStatusBadge(product.status)}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => navigate('product-form', { mode: 'edit', id: product.id })}
              >
                Editar
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                Ver Detalles
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600 mb-6">Intenta ajustar los filtros o crea un nuevo producto</p>
          <Button variant="primary" onClick={() => navigate('product-form', { mode: 'create' })}>
            Crear Primer Producto
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductList;