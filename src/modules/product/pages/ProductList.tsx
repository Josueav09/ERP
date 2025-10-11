import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activo</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Inactivo</span>;
      case 'out_of_stock':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Sin Stock</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{status}</span>;
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
        <Link to="/products/new">
          <Button variant="primary">
            + Nuevo Producto
          </Button>
        </Link>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <div key={product.id} className="bg-white rounded-lg shadow p-6 transition-all duration-200 hover:shadow-lg">
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
              <Link to={`/products/edit/${product.id}`} className="flex-1">
                <Button variant="primary" size="sm" fullWidth>
                  Editar
                </Button>
              </Link>
              <Link to={`/products/${product.id}`} className="flex-1">
                <Button variant="outline" size="sm" fullWidth>
                  Ver Detalles
                </Button>
              </Link>
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
          <Link to="/products/new">
            <Button variant="primary">
              Crear Primer Producto
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;