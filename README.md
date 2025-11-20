# 🏢 Inversiones Arar - Sistema Web

> Modernización del sistema web institucional para Inversiones Arar y sus empresas afiliadas.

**Desarrollado por:** Yariangel Aray  
**Fecha de inicio:** Noviembre 2025 
**Estado:** En desarrollo (Módulo público completado)

---

## 📋 Descripción del Proyecto

Este proyecto es una **refactorización completa** del antiguo sistema web de Inversiones Arar (holding empresarial). La versión anterior contenía módulos obsoletos y tecnología desactualizada, por lo que se decidió reconstruir desde cero con tecnologías modernas.

### Estado Actual
✅ **Completado:** Módulo público (páginas institucionales)  
🚧 **En desarrollo:** Intranet (dashboard administrativo)

---

## 🛠️ Stack Tecnológico

### Backend
- **PHP:** 8.2
- **Framework:** Laravel 11
- **Autenticación:** Laravel Sanctum
- **Base de datos:** SQL Server (2 conexiones)
  - `BD_Arar` (principal)
  - `UNOEEARAR` (secundaria - especificada en modelos con `sqlsrv_second`)

### Frontend
- **Framework:** React 18 con TypeScript
- **Routing:** Inertia.js 2.0
- **Estilos:** Tailwind CSS 3
- **Componentes UI:** shadcn/ui (almacenados en `components/ui`)
- **Iconos:** Lucide React
- **Animaciones:** Framer Motion
- **Validaciones:** Zod
- **Temas:** next-themes

### Starter Kit
- **Laravel Breeze** con stack React + Inertia + TypeScript

---

## 📁 Estructura del Proyecto

```
resources/
└── js/
    └── Pages/
        └── Public/          # Páginas públicas del sitio
            ├── Home.tsx     # Página principal
            ├── Portafolio.tsx
            ├── Empresas.tsx
            ├── Contacto.tsx
            └── Denuncias.tsx
```

### Componentes UI (shadcn)
Los componentes de shadcn/ui están ubicados en `components/ui/`. Algunos componentes han sido instalados y **modificados** para adaptarse al diseño personalizado del proyecto.

---

## 🌐 Módulos Públicos

### 1. **Home** (`/`)
Página principal con información institucional sobre Inversiones Arar, misión, visión y valores corporativos.

### 2. **Portafolio** (`/portafolio`)
Muestra los servicios ofrecidos y los clientes/empresas del holding.

### 3. **Empresas** (`/empresas`)
Directorio de empresas afiliadas al holding Inversiones Arar.

### 4. **Contacto** (`/contacto`)
- Datos de contacto institucional
- Formulario de contacto (envío por correo, **no se almacena en BD**)

### 5. **Denuncias** (`/denuncias`)
Sistema PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias) con formulario de **4 pasos**:

#### Flujo Normal (PQRS)
1. **Tipo de solicitud:** P, Q, R, S o Denuncia (Si es Denuncia puede seleccionar otras empresas y hacerla anonimamente)
2. **Información personal:** Datos del solicitante
3. **Contacto y ubicación**
4. **Descripción y archivos adjuntos**

#### Flujo Denuncias Anónimas
- Selección de empresa a denunciar
- Checkbox "Denuncia anónima"
- Si es anónima: Solo paso 1 (empresa) + paso 4 (descripción)

**Características:**
- Las PQRS se asocian por defecto a Inversiones Arar
- Las denuncias pueden dirigirse a múltiples empresas del holding
- Envío de correo a personas designadas (especificadas en `PQRSDController`)
- Correo de confirmación al solicitante (excepto denuncias anónimas)
- Almacenamiento en tabla `pqrsds`
- Archivos adjuntos en: `storage/app/public/pqrsd/{año}/{mes}/{día}/{radicado}/`
- Denuncias anónimas: carpeta `anonimo_{radicado}`

---

## 🔐 Sistema de Autenticación

### Inicio de Sesión
- **Credenciales:** Número de documento + Contraseña
- **Ruta:** `/login`

### Recuperación de Contraseña
1. Usuario ingresa número de documento
2. Sistema busca correo asociado
3. Envío de correo con enlace de recuperación
4. Usuario establece nueva contraseña
5. Acceso restaurado

---

## 🔗 Enlaces Externos del Header

El header del sitio contiene tres botones principales:

1. **Gestión Humana** (Dropdown)
   - Desplegable con empresas filiales
   - Redirige a sistema externo de gestión humana
   
2. **Intranet**
   - Acceso al sistema administrativo interno (Laravel Auth)
   
3. **GLPI**
   - Enlace a sistema externo GLPI

---

## 📦 Instalación y Configuración

### Requisitos Previos
- PHP 8.2 o superior
- Composer
- Node.js y npm
- SQL Server

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>

# 2. Instalar dependencias de PHP
composer install

# 3. Instalar dependencias de Node
npm install

# 4. Configurar archivo .env
cp .env.example .env
# Editar .env con las credenciales de base de datos

# 5. Generar key de aplicación
php artisan key:generate

# 6. Ejecutar migraciones (En caso de trabajar con otra base de datos)
php artisan migrate

# 7. Crear enlace simbólico para storage
php artisan storage:link

# 8. Compilar assets
npm run build
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo con todos los servicios
composer dev

# O manualmente:
php artisan serve          # Servidor Laravel
php artisan queue:listen   # Cola de trabajos
php artisan pail           # Logs en tiempo real
npm run dev                # Vite dev server
```

---

## 🗄️ Base de Datos

El proyecto utiliza **dos conexiones** a SQL Server:

### Conexión Principal (`sqlsrv`)
Base de datos: `BD_Arar`  
Usada por defecto en todos los modelos.

### Conexión Secundaria (`sqlsrv_second`)
Base de datos: `UNOEEARAR`  
Se especifica explícitamente en los modelos que la requieren:

```php
protected $connection = 'sqlsrv_second';
```

### Tablas Principales

#### Autenticación y Seguridad
- `usuarios` - Usuarios del sistema con control de intentos fallidos y bloqueos
- `password_reset_tokens` - Tokens para recuperación de contraseña
- `sessions` - Sesiones activas de usuarios

#### Sistema de Auditoría
- `auditorias` - Registro completo de cambios (INSERT, UPDATE, DELETE) en todas las tablas
  - **Nota importante:** Todos los modelos deben implementar el trait de auditoría para registrar automáticamente los cambios
  - Utiliza SoftDeletes, por lo que los registros no se eliminan físicamente

#### Catálogos (Tablas Maestras)
- `tipos_pqrs` - Tipos de solicitudes (Petición, Queja, Reclamo, Sugerencia, Denuncia)
- `tipos_identificaciones` - Tipos de documentos de identidad (CC, CE, NIT, etc.)
- `estados_pqrs` - Estados del flujo de PQRS (Pendiente, En Proceso, Resuelto, etc.)

#### Módulo PQRSD
- `pqrsds` - Registro completo de PQRS y denuncias con:
  - Información de la empresa
  - Datos personales del solicitante (nullable para denuncias anónimas)
  - Información de contacto y ubicación
  - Descripción y archivos adjuntos (JSON)
  - Estado y seguimiento con usuario asignado
  - Índices optimizados para búsquedas por empresa, tipo, estado y fecha

---

## 📚 Documentación de Tecnologías

- [Laravel 11](https://laravel.com/docs/11.x)
- [React](https://react.dev/)
- [Inertia.js](https://inertiajs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Zod](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)
- [Laravel Breeze](https://laravel.com/docs/11.x/starter-kits#laravel-breeze)

---

## 📝 Notas Importantes

- ⚠️ **El archivo `.env` NO está incluido en el repositorio** (configuración local)
- 📧 Los correos de notificación se configuran en el controlador `PQRSDController`
- 🚧 El módulo de intranet/dashboard está pendiente de desarrollo
- 🔍 **Auditoría obligatoria:** Todos los modelos deben incluir el trait de auditoría para registrar cambios automáticamente
- 🗑️ **SoftDeletes activo:** Los registros no se eliminan físicamente, solo se marca `deleted_at`
- 🔢 **SQL Server:** Algunas migraciones incluyen modificaciones específicas para datetime2

---

## 🤝 Contribución

Este es un proyecto privado para Inversiones Arar. Cualquier modificación debe ser coordinada con el equipo de desarrollo.

---

## 📄 Licencia

Propietario: Inversiones Arar  
Todos los derechos reservados © 2025