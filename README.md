# 🏢 Sistema ERP Frontend

Sistema ERP completo desarrollado con **React 18 + Vite + TypeScript + Tailwind CSS**

## 🎨 Características

- ✅ Autenticación con 2FA y seguridad avanzada
- ✅ Gestión de Productos (CRUD completo)
- ✅ Marketing y Leads (con temperatura hot/warm/cold)
- ✅ Oportunidades de Ventas (Pipeline completo)
- ✅ Reportería y Analytics
- ✅ Desempeño Personal y KPIs
- ✅ Capacitación y Learning
- ✅ Gestión de Usuarios
- ✅ Diseño responsive y moderno
- ✅ Paleta de colores personalizada (#0A332C, #1E4640, #B5E385, #C9E993)

## 📦 Instalación

### 1. Clonar o descargar el proyecto

```bash
# Si tienes el proyecto en git
git clone <tu-repositorio>
cd erp-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está incluido con la configuración por defecto. Ajústalo según tus necesidades.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El sistema estará disponible en: `http://localhost:3000`

## 🚀 Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Vista previa de producción
npm run lint     # Ejecuta linter
```

## 🔐 Credenciales de Acceso (Demo)

Para probar el sistema en modo demo:

- **Email**: cualquier email válido
- **Contraseña**: cualquier contraseña
- **Código 2FA**: cualquier código de 6 dígitos
- **Captcha**: escribir "erp"

## 📁 Estructura del Proyecto

```
erp-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/           # Imágenes e iconos
│   ├── components/       # Componentes reutilizables
│   │   ├── common/       # Button, Input, Modal
│   │   └── layout/       # Navbar, Sidebar, Footer
│   ├── context/          # Context API
│   │   ├── AuthContext.tsx
│   │   └── NavigationContext.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   ├── layouts/          # Layouts de páginas
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── modules/          # Módulos del sistema
│   │   ├── product/
│   │   ├── marketing/
│   │   ├── sales/
│   │   ├── reporting/
│   │   ├── personal/
│   │   ├── learning/
│   │   └── users/
│   ├── pages/            # Páginas principales
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   └── NotFound.tsx
│   ├── routes/           # Configuración de rutas
│   │   └── AppRoutes.tsx
│   ├── services/         # Servicios API
│   │   ├── api.ts
│   │   └── authService.ts
│   ├── styles/           # Estilos globales
│   │   └── index.css
│   ├── types/            # Tipos TypeScript
│   │   ├── auth.d.ts
│   │   ├── user.d.ts
│   │   ├── product.d.ts
│   │   ├── marketing.d.ts
│   │   ├── sales.d.ts
│   │   └── api.d.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## 🎨 Paleta de Colores

- **Primary Dark**: `#0A332C`
- **Primary**: `#1E4640`
- **Accent**: `#B5E385`
- **Accent Light**: `#C9E993`

## 🔧 Tecnologías

- **React 18**: Biblioteca principal
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **Tailwind CSS**: Framework de estilos
- **Axios**: Cliente HTTP
- **Context API**: Gestión de estado
- **React Hooks**: useState, useEffect, useContext, etc.

## 📱 Módulos del Sistema

### 1. **Productos** (`/products`)
- CRUD completo de productos
- Gestión de variantes
- Control de inventario
- Categorías

### 2. **Marketing** (`/marketing`)
- Gestión de leads
- Temperatura (Hot/Warm/Cold)
- Fuentes de leads
- Conversión a oportunidades

### 3. **Ventas** (`/sales`)
- Pipeline de oportunidades
- Etapas de venta
- Cotizaciones
- Probabilidad de cierre

### 4. **Reportes** (`/reports`)
- KPIs en tiempo real
- Análisis de ventas
- Top performers
- Productos más vendidos
- Embudo de conversión

### 5. **Desempeño Personal** (`/personal`)
- KPIs individuales
- Historial de rendimiento
- Objetivos vs resultados
- Información del contrato

### 6. **Capacitación** (`/learning`)
- Cursos en línea
- Biblioteca de recursos
- Certificaciones
- Progreso de aprendizaje

### 7. **Usuarios** (`/users`)
- Gestión de usuarios
- Roles y permisos
- CRUD de usuarios

## 🔒 Seguridad

- Autenticación con JWT
- Cierre automático de sesión (10 min inactividad)
- Bloqueo tras intentos fallidos
- Autenticación de 2 factores (2FA)
- Captcha de verificación
- Rutas protegidas por rol

## 🌐 Configuración de API

El sistema está preparado para conectarse a microservicios backend. Configura las URLs en el archivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_PRODUCT_SERVICE_URL=http://localhost:8001/api/product
VITE_MARKETING_SERVICE_URL=http://localhost:8002/api/marketing
VITE_SALES_SERVICE_URL=http://localhost:8003/api/sales
# ... etc
```

## 📝 Notas de Desarrollo

- El sistema actualmente usa datos **mock** para desarrollo
- Para producción, descomentar las llamadas API reales en los servicios
- Los interceptores de Axios están configurados para manejar tokens JWT
- El sistema incluye refresh token automático

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👨‍💻 Autor

Desarrollado con ❤️ para un sistema ERP empresarial moderno.

---

**¿Necesitas ayuda?** Consulta la documentación o contacta al equipo de desarrollo.