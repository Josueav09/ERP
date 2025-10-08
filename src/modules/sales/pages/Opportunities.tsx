import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

interface Opportunity {
  id: string;
  clientName: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  nextAction: string;
  lastContact: string;
  assignedTo: string;
}

const Opportunities: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');

  const opportunities: Opportunity[] = [
    { id: '1', clientName: 'Juan Rodríguez', company: 'Empresa XYZ Corp', value: 45000, stage: 'negotiation', probability: 75, nextAction: 'Enviar propuesta final', lastContact: '2024-10-03', assignedTo: 'María González' },
    { id: '2', clientName: 'Ana Silva', company: 'Corporación ABC SAC', value: 78000, stage: 'qualification', probability: 40, nextAction: 'Reunión de descubrimiento', lastContact: '2024-10-02', assignedTo: 'Carlos Ramírez' },
    { id: '3', clientName: 'Pedro Martínez', company: 'Tech Solutions EIRL', value: 120000, stage: 'closing', probability: 90, nextAction: 'Firma de contrato', lastContact: '2024-10-04', assignedTo: 'María González' },
    { id: '4', clientName: 'Laura Castro', company: 'Innovate Group', value: 32000, stage: 'proposal', probability: 60, nextAction: 'Presentación ejecutiva', lastContact: '2024-10-01', assignedTo: 'Ana Torres' },
  ];

  const stages = [
    { key: 'prospecting', label: 'Prospección', color: 'bg-gray-500', count: 12 },
    { key: 'qualification', label: 'Calificación', color: 'bg-blue-500', count: 8 },
    { key: 'proposal', label: 'Propuesta', color: 'bg-yellow-500', count: 15 },
    { key: 'negotiation', label: 'Negociación', color: 'bg-orange-500', count: 10 },
    { key: 'closing', label: 'Cierre', color: 'bg-green-500', count: 5 },
  ];

  const getStageInfo = (stage: string) => {
    const info = stages.find(s => s.key === stage);
    return info || stages[0];
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || opp.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const avgProbability = Math.round(opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Gestión de Oportunidades</h1>
          <p className="text-gray-600 mt-1">Administra tu pipeline de ventas</p>
        </div>
        <Button variant="primary" onClick={() => navigate('sales-form', { mode: 'create' })}>
          + Nueva Oportunidad
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-90 mb-1">Oportunidades Activas</p>
          <p className="text-4xl font-bold">{opportunities.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-90 mb-1">Valor Total Pipeline</p>
          <p className="text-4xl font-bold">${(totalValue / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-90 mb-1">Probabilidad Promedio</p>
          <p className="text-4xl font-bold">{avgProbability}%</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-90 mb-1">Cierre Este Mes</p>
          <p className="text-4xl font-bold">12</p>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.key} className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition">
            <div className={`${stage.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2`}>
              {stage.count}
            </div>
            <p className="text-sm font-semibold text-gray-700">{stage.label}</p>
            <p className="text-xs text-gray-500 mt-1">${Math.floor(Math.random() * 500)}K</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Buscar por cliente o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="input-field">
            <option value="all">Todas las etapas</option>
            {stages.map(stage => (
              <option key={stage.key} value={stage.key}>{stage.label}</option>
            ))}
          </select>
          <Button variant="secondary">Aplicar Filtros</Button>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          const stageInfo = getStageInfo(opp.stage);
          return (
            <div key={opp.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition animate-fadeIn">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-primary-dark">{opp.clientName}</h3>
                    <span className={`${stageInfo.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {stageInfo.label}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">🏢 {opp.company}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Valor</p>
                      <p className="font-bold text-primary text-lg">${opp.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Probabilidad</p>
                      <p className="font-bold text-green-600 text-lg">{opp.probability}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Asignado a</p>
                      <p className="font-semibold text-gray-800">{opp.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Último contacto</p>
                      <p className="font-semibold text-gray-800">{opp.lastContact}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-primary">🎯</span>
                    <span className="text-gray-700">{opp.nextAction}</span>
                  </div>
                </div>
                <div className="flex lg:flex-col gap-2">
                  <Button variant="primary" size="sm" onClick={() => navigate('sales-form', { mode: 'edit', id: opp.id })}>
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                  <Button variant="success" size="sm">
                    Avanzar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron oportunidades</h3>
          <p className="text-gray-600 mb-6">Intenta ajustar los filtros o crea una nueva oportunidad</p>
          <Button variant="primary" onClick={() => navigate('sales-form', { mode: 'create' })}>
            Crear Primera Oportunidad
          </Button>
        </div>
      )}
    </div>
  );
};

export default Opportunities;