import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  temperature: 'hot' | 'warm' | 'cold';
  source: string;
  status: string;
  createdAt: string;
}

const Leads: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTemp, setFilterTemp] = useState('all');

  const leads: Lead[] = [
    { id: '1', name: 'Juan Pérez', email: 'juan@empresa.com', phone: '+51 987 654 321', company: 'Tech Corp', temperature: 'hot', source: 'Evento Tech Summit', status: 'nuevo', createdAt: '2024-10-01' },
    { id: '2', name: 'María García', email: 'maria@empresa.com', phone: '+51 987 654 322', company: 'Innovate SA', temperature: 'warm', source: 'LinkedIn', status: 'contactado', createdAt: '2024-10-02' },
    { id: '3', name: 'Carlos López', email: 'carlos@empresa.com', phone: '+51 987 654 323', company: 'Solutions Inc', temperature: 'cold', source: 'Referido', status: 'calificando', createdAt: '2024-10-03' },
    { id: '4', name: 'Ana Torres', email: 'ana@empresa.com', phone: '+51 987 654 324', company: 'Digital Group', temperature: 'hot', source: 'Redes Sociales', status: 'nuevo', createdAt: '2024-10-04' },
  ];

  const getTempColor = (temp: string) => {
    switch (temp) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTempEmoji = (temp: string) => {
    switch (temp) {
      case 'hot': return '🔥';
      case 'warm': return '☀️';
      case 'cold': return '❄️';
      default: return '📊';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemp = filterTemp === 'all' || lead.temperature === filterTemp;
    return matchesSearch && matchesTemp;
  });

  const stats = {
    hot: leads.filter(l => l.temperature === 'hot').length,
    warm: leads.filter(l => l.temperature === 'warm').length,
    cold: leads.filter(l => l.temperature === 'cold').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Gestión de Leads</h1>
          <p className="text-gray-600 mt-1">Administra y convierte tus leads en oportunidades</p>
        </div>
        <Button variant="primary" onClick={() => navigate('marketing-form', { mode: 'create' })}>
          + Nuevo Lead
        </Button>
      </div>

      {/* Temperature Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Leads HOT</h3>
            <span className="text-4xl">🔥</span>
          </div>
          <p className="text-5xl font-bold mb-2">{stats.hot}</p>
          <p className="text-sm opacity-90">Alta probabilidad de conversión</p>
          <div className="mt-4 pt-4 border-t border-red-400">
            <p className="text-sm">Tasa de conversión: <span className="font-bold">65%</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Leads WARM</h3>
            <span className="text-4xl">☀️</span>
          </div>
          <p className="text-5xl font-bold mb-2">{stats.warm}</p>
          <p className="text-sm opacity-90">Requieren seguimiento activo</p>
          <div className="mt-4 pt-4 border-t border-yellow-400">
            <p className="text-sm">Tasa de conversión: <span className="font-bold">35%</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Leads COLD</h3>
            <span className="text-4xl">❄️</span>
          </div>
          <p className="text-5xl font-bold mb-2">{stats.cold}</p>
          <p className="text-sm opacity-90">Bajo interés actual</p>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <p className="text-sm">Tasa de conversión: <span className="font-bold">12%</span></p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <select value={filterTemp} onChange={(e) => setFilterTemp(e.target.value)} className="input-field">
            <option value="all">Todas las temperaturas</option>
            <option value="hot">🔥 Hot</option>
            <option value="warm">☀️ Warm</option>
            <option value="cold">❄️ Cold</option>
          </select>
          <Button variant="secondary">Aplicar Filtros</Button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary">
              <tr>
                <th className="table-header">Lead</th>
                <th className="table-header">Empresa</th>
                <th className="table-header">Contacto</th>
                <th className="table-header">Temperatura</th>
                <th className="table-header">Fuente</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary-dark font-bold mr-3">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getTempColor(lead.temperature)}`}>
                      {getTempEmoji(lead.temperature)} {lead.temperature.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge-info capitalize">{lead.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-green-600 hover:text-green-900 font-semibold">Convertir</button>
                    <button className="text-blue-600 hover:text-blue-900">Editar</button>
                    <button className="text-gray-600 hover:text-gray-900">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron leads</h3>
          <p className="text-gray-600 mb-6">Intenta ajustar los filtros o crea un nuevo lead</p>
          <Button variant="primary" onClick={() => navigate('marketing-form', { mode: 'create' })}>
            Crear Primer Lead
          </Button>
        </div>
      )}
    </div>
  );
};

export default Leads;