import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';

const Performance: React.FC = () => {
  useAuth();

  const kpis = [
    { kpi: 'Llamadas Realizadas', current: 145, target: 150, unit: '', icon: '📞' },
    { kpi: 'Reuniones Programadas', current: 28, target: 30, unit: '', icon: '📅' },
    { kpi: 'Propuestas Enviadas', current: 18, target: 20, unit: '', icon: '📄' },
    { kpi: 'Tasa de Conversión', current: 32, target: 30, unit: '%', icon: '🎯' },
  ];

  const performanceHistory = [
    { period: 'Octubre 2024', score: 95, sales: 24, highlight: true },
    { period: 'Septiembre 2024', score: 92, sales: 22, highlight: false },
    { period: 'Agosto 2024', score: 89, sales: 19, highlight: false },
    { period: 'Julio 2024', score: 86, sales: 18, highlight: false },
    { period: 'Junio 2024', score: 88, sales: 20, highlight: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Mi Desempeño</h1>
          <p className="text-gray-600 mt-1">Seguimiento de objetivos y rendimiento personal</p>
        </div>
        <Button variant="primary">📊 Descargar Reporte</Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold mb-3 opacity-90">Desempeño General</h3>
          <div className="relative pt-2">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-6xl font-bold">87%</span>
              </div>
            </div>
            <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-white bg-opacity-20">
              <div style={{ width: "87%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-accent animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm opacity-90">Cumplimiento de objetivos del mes</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold mb-3 opacity-90">Ventas Cerradas</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-6xl font-bold mb-2">24</p>
              <p className="text-sm font-semibold">Meta mensual: 30</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-200">+6</p>
              <p className="text-xs opacity-90">vs mes anterior</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold mb-3 opacity-90">Valor Generado</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-6xl font-bold mb-2">$890K</p>
              <p className="text-sm font-semibold">Meta mensual: $1M</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-200">+18%</p>
              <p className="text-xs opacity-90">vs mes anterior</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-primary-dark mb-6">KPIs del Mes</h2>
          <div className="space-y-5">
            {kpis.map((item, i) => {
              const percentage = (item.current / item.target) * 100;
              const isAchieved = percentage >= 100;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{item.kpi}</span>
                    </div>
                    <span className={`text-sm font-bold ${isAchieved ? 'text-green-600' : 'text-primary'}`}>
                      {item.current}{item.unit} / {item.target}{item.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${isAchieved ? 'bg-green-500' : 'bg-accent'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {isAchieved && (
                    <p className="text-xs text-green-600 font-semibold">✅ Meta alcanzada</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-primary-dark mb-6">Historial de Rendimiento</h2>
          <div className="space-y-3">
            {performanceHistory.map((period, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-4 rounded-lg transition ${
                  period.highlight ? 'bg-accent bg-opacity-20 border-2 border-accent' : 'bg-gray-50'
                }`}
              >
                <div>
                  <p className={`font-medium ${period.highlight ? 'text-primary-dark' : 'text-gray-700'}`}>
                    {period.period}
                  </p>
                  <p className="text-sm text-gray-500">{period.sales} ventas cerradas</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-3xl font-bold ${period.highlight ? 'text-primary' : 'text-gray-800'}`}>
                    {period.score}%
                  </span>
                  {period.highlight && <span className="text-2xl">⭐</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contract Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-primary-dark mb-6">Información del Contrato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Fecha de Inicio</p>
            <p className="text-lg font-bold text-primary-dark">01 Enero, 2024</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Tipo de Contrato</p>
            <p className="text-lg font-bold text-primary-dark">Plazo Indeterminado</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Cargo</p>
            <p className="text-lg font-bold text-primary-dark">Ejecutiva de Ventas Senior</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Departamento</p>
            <p className="text-lg font-bold text-primary-dark">Ventas Corporativas</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-primary-dark mb-6">Logros y Reconocimientos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🏆', title: 'Top Seller', desc: 'Octubre 2024' },
            { icon: '🎯', title: '100% Meta', desc: '3 meses consecutivos' },
            { icon: '⭐', title: 'Mejor Cierre', desc: '$250K en un deal' },
            { icon: '📈', title: 'Crecimiento', desc: '+35% este trimestre' },
          ].map((achievement, i) => (
            <div key={i} className="p-4 bg-gradient-to-br from-accent to-accent-light rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="font-bold text-primary-dark text-sm">{achievement.title}</p>
              <p className="text-xs text-gray-600 mt-1">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;