import React, { useState } from 'react';
import Button from '../../../components/common/Button';

const DashboardReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const kpiStats = [
    { label: 'Conversión Leads → Oportunidades', value: '18.5%', change: '+2.3%', positive: true, icon: '🎯' },
    { label: 'Tiempo Promedio de Cierre', value: '45 días', change: '-5 días', positive: true, icon: '⏱️' },
    { label: 'Tasa de Éxito', value: '32%', change: '+4.1%', positive: true, icon: '✅' },
    { label: 'Valor Pipeline', value: '$1.2M', change: '+15%', positive: true, icon: '💰' },
  ];

  const salesByMonth = [
    { month: 'Enero', sales: 85000, target: 100000 },
    { month: 'Febrero', sales: 92000, target: 100000 },
    { month: 'Marzo', sales: 108000, target: 100000 },
    { month: 'Abril', sales: 95000, target: 110000 },
    { month: 'Mayo', sales: 125000, target: 110000 },
    { month: 'Junio', sales: 118000, target: 110000 },
  ];

  const topSales = [
    { name: 'María González', sales: 15, value: 450000, rank: 1 },
    { name: 'Ana Rodríguez', sales: 12, value: 380000, rank: 2 },
    { name: 'Carmen Silva', sales: 10, value: 320000, rank: 3 },
    { name: 'Laura Martínez', sales: 8, value: 280000, rank: 4 },
    { name: 'Patricia Díaz', sales: 7, value: 245000, rank: 5 },
  ];

  const topProducts = [
    { product: 'Laptop Pro X1', units: 245, revenue: 318000, growth: 12 },
    { product: 'Smartphone Z9', units: 389, revenue: 350000, growth: 8 },
    { product: 'Tablet Elite', units: 156, revenue: 93000, growth: -3 },
    { product: 'Monitor 4K', units: 198, revenue: 89000, growth: 15 },
    { product: 'Auriculares Premium', units: 423, revenue: 105000, growth: 22 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">Métricas clave de desempeño y análisis de ventas</p>
        </div>
        <div className="flex gap-2">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="input-field">
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Año</option>
          </select>
          <Button variant="primary">
            📊 Exportar Reporte
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">{stat.icon}</span>
              <span className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-primary-dark">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-2">vs {selectedPeriod === 'month' ? 'mes' : 'periodo'} anterior</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Month */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-dark">Ventas vs Objetivos</h2>
            <span className="text-sm text-gray-500">Últimos 6 meses</span>
          </div>
          <div className="space-y-4">
            {salesByMonth.map((item, i) => {
              const percentage = (item.sales / item.target) * 100;
              const achieved = item.sales >= item.target;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{item.month}</span>
                    <span className="text-primary-dark font-bold">
                      ${(item.sales / 1000).toFixed(0)}K / ${(item.target / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${achieved ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% del objetivo</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-dark">Top Ejecutivas del Mes</h2>
            <span className="text-sm text-gray-500">Ranking</span>
          </div>
          <div className="space-y-3">
            {topSales.map((exec) => (
              <div key={exec.rank} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                    exec.rank === 1 ? 'bg-yellow-500' : exec.rank === 2 ? 'bg-gray-400' : exec.rank === 3 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                >
                  {exec.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{exec.name}</p>
                  <p className="text-sm text-gray-500">{exec.sales} ventas · ${(exec.value / 1000).toFixed(0)}K</p>
                </div>
                <span className="text-3xl">
                  {exec.rank === 1 ? '🏆' : exec.rank === 2 ? '🥈' : exec.rank === 3 ? '🥉' : '⭐'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-dark">Productos Más Vendidos</h2>
          <Button variant="outline" size="sm">
            Ver Reporte Completo
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unidades Vendidas</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Crecimiento</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4 text-gray-900 font-medium">{item.product}</td>
                  <td className="py-4 px-4 text-gray-600">{item.units}</td>
                  <td className="py-4 px-4 font-semibold text-primary">${(item.revenue / 1000).toFixed(0)}K</td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.growth >= 0 ? '+' : ''}{item.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-primary-dark mb-6">Embudo de Conversión</h2>
        <div className="space-y-4">
          {[
            { stage: 'Leads Generados', count: 1250, percentage: 100, color: 'bg-blue-500' },
            { stage: 'Leads Calificados', count: 875, percentage: 70, color: 'bg-green-500' },
            { stage: 'Oportunidades Creadas', count: 438, percentage: 35, color: 'bg-yellow-500' },
            { stage: 'Propuestas Enviadas', count: 219, percentage: 17.5, color: 'bg-orange-500' },
            { stage: 'Ventas Cerradas', count: 88, percentage: 7, color: 'bg-purple-500' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">{item.stage}</span>
                <span className="text-primary-dark font-bold">{item.count} ({item.percentage}%)</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className={`${item.color} h-full rounded-full transition-all`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardReports;