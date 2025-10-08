import React, { useState } from 'react';
import Button from '../../../components/common/Button';

interface Course {
  id: string;
  title: string;
  progress: number;
  duration: string;
  category: string;
  icon: string;
  instructor: string;
  lessons: number;
}

const Courses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses: Course[] = [
    { id: '1', title: 'Técnicas Avanzadas de Ventas', progress: 75, duration: '4 horas', category: 'Ventas', icon: '🎯', instructor: 'Carlos Méndez', lessons: 12 },
    { id: '2', title: 'Negociación Efectiva', progress: 100, duration: '3 horas', category: 'Ventas', icon: '🤝', instructor: 'Ana López', lessons: 10 },
    { id: '3', title: 'CRM y Gestión de Clientes', progress: 45, duration: '5 horas', category: 'Herramientas', icon: '💼', instructor: 'Jorge Ramírez', lessons: 15 },
    { id: '4', title: 'Marketing Digital B2B', progress: 0, duration: '6 horas', category: 'Marketing', icon: '📱', instructor: 'María Torres', lessons: 18 },
    { id: '5', title: 'Inteligencia Emocional', progress: 60, duration: '4 horas', category: 'Desarrollo Personal', icon: '🧠', instructor: 'Patricia Díaz', lessons: 14 },
    { id: '6', title: 'Prospección en LinkedIn', progress: 30, duration: '3 horas', category: 'Herramientas', icon: '💼', instructor: 'Luis García', lessons: 8 },
  ];

  const categories = ['all', 'Ventas', 'Marketing', 'Herramientas', 'Desarrollo Personal'];

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'all' || course.category === selectedCategory
  );

  const stats = {
    completed: courses.filter(c => c.progress === 100).length,
    inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
    totalHours: courses.reduce((sum, c) => sum + parseInt(c.duration), 0),
  };

  const resources = [
    { title: 'Guía de Ventas Consultivas', type: 'PDF', size: '2.4 MB', icon: '📄' },
    { title: 'Video: Cierre de Ventas', type: 'Video', size: '45 min', icon: '🎥' },
    { title: 'Plantillas de Propuestas', type: 'DOCX', size: '890 KB', icon: '📝' },
    { title: 'Case Studies Exitosos', type: 'PDF', size: '3.1 MB', icon: '📊' },
    { title: 'Webinar: Prospección B2B', type: 'Video', size: '1h 20min', icon: '🎥' },
    { title: 'Scripts de Llamadas', type: 'PDF', size: '1.2 MB', icon: '📞' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Capacitación y Desarrollo</h1>
          <p className="text-gray-600 mt-1">Cursos, recursos y certificaciones</p>
        </div>
        <Button variant="primary">🏆 Ver Certificados</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Cursos Completados</h3>
            <span className="text-4xl">✅</span>
          </div>
          <p className="text-5xl font-bold mb-2">{stats.completed}</p>
          <p className="text-sm opacity-90">+{courses.filter(c => c.progress === 100).length} este trimestre</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">En Progreso</h3>
            <span className="text-4xl">📚</span>
          </div>
          <p className="text-5xl font-bold mb-2">{stats.inProgress}</p>
          <p className="text-sm opacity-90">Cursos activos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Horas de Capacitación</h3>
            <span className="text-4xl">⏱️</span>
          </div>
          <p className="text-5xl font-bold mb-2">{stats.totalHours}</p>
          <p className="text-sm opacity-90">Este trimestre</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? 'bg-primary text-accent'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Todos los Cursos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{course.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-primary-dark">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.category} · {course.duration}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Instructor: {course.instructor}</span>
                <span className="text-gray-600">{course.lessons} lecciones</span>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-semibold text-primary">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      course.progress === 100 ? 'bg-green-500' : course.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <Button
              variant={course.progress === 0 ? 'primary' : course.progress === 100 ? 'success' : 'secondary'}
              fullWidth
            >
              {course.progress === 0 ? 'Comenzar Curso' : course.progress === 100 ? '✅ Completado - Revisar' : 'Continuar Curso'}
            </Button>
          </div>
        ))}
      </div>

      {/* Resources Library */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-dark">Biblioteca de Recursos</h2>
          <Button variant="outline" size="sm">Ver Todos</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl">{resource.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{resource.title}</h4>
                  <p className="text-xs text-gray-500">{resource.type} · {resource.size}</p>
                  <button className="text-sm text-primary hover:text-primary-dark font-medium mt-2">
                    Descargar →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-primary-dark mb-6">Mis Certificaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Ventas Avanzadas', date: 'Octubre 2024', badge: '🏆' },
            { title: 'Negociación Efectiva', date: 'Septiembre 2024', badge: '🥇' },
            { title: 'CRM Expert', date: 'Agosto 2024', badge: '⭐' },
          ].map((cert, i) => (
            <div key={i} className="bg-gradient-to-br from-accent to-accent-light p-6 rounded-lg text-center">
              <div className="text-5xl mb-3">{cert.badge}</div>
              <h4 className="font-bold text-primary-dark mb-1">{cert.title}</h4>
              <p className="text-sm text-gray-600">{cert.date}</p>
              <Button variant="outline" size="sm" className="mt-4">
                Ver Certificado
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;