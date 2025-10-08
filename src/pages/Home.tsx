import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Leads Activos', value: '127', color: 'from-blue-500 to-blue-600', icon: '👥' },
    { label: 'Oportunidades', value: '43', color: 'from-green-500 to-green-600', icon: '💼' },
    { label: 'Ventas del Mes', value: '$125K', color: 'from-purple-500 to-purple-600', icon: '💰' },
    { label: 'Productos', value: '89', color: 'from-orange-500 to-orange-600', icon: '📦' },
  ];

  const recentActivities = [
    { action: 'Nueva oportunidad creada', time: 'Hace 5 min', icon: '✨', color: 'bg-yellow-100 text-yellow-600' },
    { action: 'Lead convertido', time: 'Hace 1 hora', icon: '🎯', color: 'bg-green-100 text-green-600' },
    { action: 'Cotización enviada', time: 'Hace 2 horas', icon: '📄', color: 'bg-blue-100 text-blue-600' },
    { action: 'Reunión programada', time: 'Hace 3 horas', icon: '📅', color: 'bg-purple-100 text-purple-600' },
  ];

  const salesPipeline = [
    { stage: 'Prospección', percentage: 100, count: 45 },
    { stage: 'Calificación', percentage: 85, count: 38 },
    { stage: 'Propuesta', percentage: 70, count: 32 },
    { stage: 'Negociación', percentage: 55, count: 25 },
    { stage: 'Cierre', percentage: 40, count: 18 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-dark to-primary rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">
          ¡Bienvenido de vuelta, {user?.name}! 👋
        </h1>
        <p className="text-accent-light text-lg">
          Aquí está un resumen de tu actividad y rendimiento
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${stat.color} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white opacity-90 text-sm font-medium">{stat.label}</p>
                  <p className="text-white text-4xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="text-5xl opacity-80">{stat.icon}</div>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600">
                <span className="text-green-600 font-semibold">↑ 12%</span> vs mes anterior
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline de ventas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-dark">Pipeline de Ventas</h2>
            <span className="text-sm text-gray-500">158 oportunidades totales</span>
          </div>
          <div className="space-y-4">
            {salesPipeline.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.stage}</span>
                  <span className="text-primary-dark font-bold">{item.count} ops</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividades recientes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-dark">Actividades Recientes</h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              Ver todas →
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className={`${activity.color} p-3 rounded-full text-2xl`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '➕', label: 'Nuevo Lead', color: 'bg-blue-500' },
            { icon: '💼', label: 'Nueva Oportunidad', color: 'bg-green-500' },
            { icon: '📄', label: 'Crear Cotización', color: 'bg-purple-500' },
            { icon: '📊', label: 'Ver Reportes', color: 'bg-orange-500' },
          ].map((action, i) => (
            <button
              key={i}
              className={`${action.color} text-white p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="text-4xl mb-2">{action.icon}</div>
              <div className="text-sm font-semibold">{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;