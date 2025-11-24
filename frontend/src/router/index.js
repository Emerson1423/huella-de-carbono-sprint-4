import { createRouter, createWebHistory } from 'vue-router';
import Huella from '../views/Huella.vue';
import InicioView from '@/views/InicioView.vue';

const routes = [
  { 
    path: '/',
    name: 'Inicio',
    component: InicioView,
    meta: { showHelp: true }
  },
  {
    path: '/huella',
    name: 'Huella',
    component: Huella,
    meta: { requiresAuth: false, showHelp: true }
  },
  {
    path: '/resultados',
    name: 'resultados',
    component: () => import('../views/historial.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'historial',
    component: () => import('../views/historialview.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/loginviews.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('../views/registro-view.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login-google',
    name: 'LoginGoogle',
    component: () => import('../views/login-google.vue')
  },
  {
    path: '/recuperar-contra',
    name: 'RecuperarContra',
    component: () => import('../views/recuperar-contra.vue')
  },
  {
    path: '/restablecer-contra',
    name: 'RestablecerContra',
    component: () => import('../views/restablecer-contra.vue')
  },
  {
    path: '/codigo-verificacion', 
    name: 'CodigoVerificacion',
    component: () => import('../views/codigo-verificacion.vue')
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: () => import('../views/articulosView.vue'),
    meta: { showHelp: true }
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('../views/videosView.vue'),
    meta: { showHelp: true }
  },
  {
    path: '/curiosidades',
    name: 'curiosidades',
    component: () => import('../views/curiosidadesView.vue'),
    meta: { showHelp: true }
  },
  {
    path: '/noticias',
    name: 'noticias',
    component: () => import('../views/noticiasView.vue'),
    meta: { showHelp: true }
  },
  {
    path: '/habitos',
    name: 'Habitos',
    component: () => import('../views/HabitoView.vue'),
    meta: { requiresAuth: true, showHelp: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('../views/perfilView.vue'),
    meta: { requiresAuth: true, showHelp: true }
  },
  {
    path: '/completar-registro-google',
    name: 'CompletarRegistroGoogle',
    component: () => import('../views/completarRegistroview.vue'),
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: () => import('../views/eventosView.vue'),
    meta: { showHelp: true }
  },
  {
    path: '/entretenimiento',
    name: 'entretenimiento',
    component: () => import('../views/EntretenimientoView.vue'),
    meta: { requiresAuth: true }
  }, 
  {
    path: '/recicla',
    name: 'recicla',
    component: () => import('../views/juego1View.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/planta',
    name: 'planta',
    component: () => import('../views/juego2View.vue'),
    meta: { requiresAuth: true }
  }, 
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboardView.vue'),
    meta: { roles: ['admin', 'moderador'] } 
  },
  {
    path: '/soporte',
    name: 'soporte',
    component: () => import('../views/soporteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/manualComponente',
    name: 'manualComponente',
    component: () => import('../views/ManualUser.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ✅ Función auxiliar consolidada para obtener datos de autenticación
function obtenerDatosAuth() {
  const token = localStorage.getItem('token');
  const usuarioStr = localStorage.getItem('usuario');
  
  if (!token) {
    console.log('No hay token, redirigiendo a login');
    return { autenticado: false, usuario: null };
  }
  
  if (!usuarioStr) {
    console.error('No hay usuario en localStorage');
    return { autenticado: false, usuario: null };
  }
  
  try {
    const usuario = JSON.parse(usuarioStr);
    return { autenticado: true, usuario };
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    return { autenticado: false, usuario: null };
  }
}

// ✅ Función para verificar permisos de roles
function verificarPermisos(usuario, rolesPermitidos) {
  if (!usuario?.rol) {
    console.error('Usuario no tiene rol');
    return { permitido: false, mensaje: 'Usuario sin rol asignado' };
  }
  
  console.log('Rol del usuario:', usuario.rol);
  console.log('Roles permitidos:', rolesPermitidos);
  
  if (!rolesPermitidos.includes(usuario.rol)) {
    console.warn('Acceso denegado: rol insuficiente');
    const mensaje = `No tienes permisos para acceder a esta página.\nTu rol: ${usuario.rol}\nRoles permitidos: ${rolesPermitidos.join(', ')}`;
    return { permitido: false, mensaje };
  }
  
  console.log('Acceso permitido');
  return { permitido: true };
}

// ✅ Guard simplificado y optimizado
router.beforeEach((to, from, next) => {
  console.log('Navegando a:', to.path);
  
  const requiereAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiereRoles = to.meta.roles?.length > 0;
  
  // Rutas públicas
  if (!requiereAuth && !requiereRoles) {
    next();
    return;
  }
  
  // Verificar autenticación
  const { autenticado, usuario } = obtenerDatosAuth();
  
  if (!autenticado) {
    next('/login');
    return;
  }
  
  // Verificar roles si es necesario
  if (requiereRoles) {
    const { permitido, mensaje } = verificarPermisos(usuario, to.meta.roles);
    
    if (!permitido) {
      if (mensaje) alert(mensaje);
      next('/');
      return;
    }
  }
  
  next();
});

export default router;