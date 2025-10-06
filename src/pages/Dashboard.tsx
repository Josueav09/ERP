import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Leads Activos', value: '127', color: 'bg-blue-500', icon: '👥' },
    { label: 'Oportunidades', value: '43', color: 'bg-green-500', icon: '💼' },
    { label: 'Ventas del Mes', value: '$125K', color: 'bg-purple-500', icon: '💰' },
    { label: 'Productos', value: '89', color: 'bg-orange-500', icon: '📦' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0A332C] mb-6">Bienvenido, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0A332C] mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-full text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
