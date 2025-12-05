# Nombre del Proyecto

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5.15-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-lightgrey.svg)

Una breve descripción de tu proyecto y su propósito principal.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Contribución](#contribución)
- [Licencia](#licencia)

## ✨ Características

- 🔐 Autenticación con JWT y Google OAuth 2.0
- 📊 Visualización de datos con Chart.js
- 🎨 Interfaz moderna con Vue.js 3
- 🔄 API RESTful con Express
- 📧 Sistema de notificaciones por correo
- 💾 Base de datos MySQL

## 🛠️ Tecnologías

### Frontend
- **Vue.js 3.5.15** - Framework progresivo de JavaScript
- **Vue Router 4.5.1** - Enrutamiento oficial para Vue.js
- **Axios 1.9.0** - Cliente HTTP basado en promesas
- **Chart.js 4.5.1** - Librería para gráficos y visualizaciones

### Backend
- **Node.js** con **Express 5.1.0** - Framework web
- **MySQL2 3.14.1** - Cliente MySQL para Node.js
- **JWT (jsonwebtoken 9.0.2)** - Autenticación basada en tokens
- **Passport.js 0.7.0** - Middleware de autenticación
- **Bcrypt 6.0.0** - Hash de contraseñas
- **Nodemailer 7.0.3** - Envío de correos electrónicos

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v14 o superior)
- npm o yarn
- MySQL (v8.0 o superior)
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-proyecto.git
cd tu-proyecto
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuración

### Backend

1. Crea un archivo `.env` en la carpeta `backend`:

```env
# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_datos
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# Session
SESSION_SECRET=tu_clave_secreta_session

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_app

# Server
PORT=3000
NODE_ENV=development
```

2. Crea la base de datos:

```sql
CREATE DATABASE nombre_base_datos;
USE nombre_base_datos;

-- Ejecuta aquí tus scripts de creación de tablas
```

### Frontend

1. Crea un archivo `.env` en la carpeta `frontend`:

```env
VUE_APP_API_URL=http://localhost:3000/api
VUE_APP_GOOGLE_CLIENT_ID=tu_google_client_id
```

## 🎯 Uso

### Desarrollo

Inicia el servidor backend:

```bash
cd backend
node index.js
# o con nodemon para desarrollo
nodemon index.js
```

Inicia el servidor de desarrollo frontend:

```bash
cd frontend
npm run serve
```

El frontend estará disponible en `http://localhost:8080` y el backend en `http://localhost:3000`.

### Producción

Compila el frontend:

```bash
cd frontend
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## 📁 Estructura del Proyecto

```
proyecto/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── services/
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/google` | Autenticación con Google |
| POST | `/api/auth/logout` | Cerrar sesión |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Obtener todos los usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

*Agrega aquí tus endpoints específicos*

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Emerson Aldahir Portillo Segovia** - https://github.com/Emerson1423
- **Litzy Cecibel Argueta Perez** - https://github.com/Litzyzzz
- **Yohana Griselda Villalobos Segovia** - https://github.com/grisellse
  
## 🙏 Agradecimientos

- A todos los que contribuyeron a este proyecto

## 📞 Contacto

Para preguntas o sugerencias, contacta a: equiposalvambiente@gmail.com

---

⭐️ Si te gustó este proyecto, dale una estrella en GitHub!
