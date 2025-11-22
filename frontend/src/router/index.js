import { createRouter, createWebHistory } from 'vue-router';
import Huella from '../views/Huella.vue';
import InicioView from '@/views/InicioView.vue';

const routes = [
  { 
    path: '/',
    name: 'Inicio',
    component: InicioView,
  },
  {
    path: '/huella',
    name: 'Huella',
    component: Huella,
    meta: { requiresAuth: false }
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
    component: () => import('../views/articulosView.vue')
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('../views/videosView.vue')
  },
  {
    path: '/curiosidades',
    name: 'curiosidades',
    component: () => import('../views/curiosidadesView.vue')
  },
  {
    path: '/noticias',
    name: 'noticias',
    component: () => import('../views/noticiasView.vue')
  },
  {
    path: '/habitos',
    name: 'Habitos',
    component: () => import('../views/HabitoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('../views/perfilView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/completar-registro-google',
    name: 'CompletarRegistroGoogle',
    component: () => import('../views/completarRegistroview.vue'),
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: () => import('../views/eventosView.vue')
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
    meta: {roles: ['admin', 'moderador'] } 
  },
   {
    path: '/soporte',
    name: 'soporte',
    component: () => import('../views/soporteView.vue'),
    meta: { requiresAuth: true }
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔐 Guard mejorado con validación de roles
router.beforeEach((to, from, next) => {
  console.log('🔍 Navegando a:', to.path);
  
  // Verificar si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('❌ No hay token, redirigiendo a login');
      next('/login');
      return;
    }

    // Verificar roles si la ruta los requiere
    if (to.meta.roles && to.meta.roles.length > 0) {
      try {
        const usuarioStr = localStorage.getItem('usuario');
        console.log('📦 Usuario en localStorage:', usuarioStr);
        
        if (!usuarioStr) {
          console.error('❌ No hay usuario en localStorage');
          next('/login');
          return;
        }
        
        const usuario = JSON.parse(usuarioStr);
        console.log('👤 Usuario parseado:', usuario);
        
        if (!usuario || !usuario.rol) {
          console.error('❌ Usuario no tiene rol');
          next('/login');
          return;
        }

        console.log('🔑 Rol del usuario:', usuario.rol);
        console.log('🎯 Roles permitidos:', to.meta.roles);

        // Verificar si el rol del usuario está en los roles permitidos
        if (!to.meta.roles.includes(usuario.rol)) {
          console.warn('⛔ Acceso denegado: rol insuficiente');
          alert(`No tienes permisos para acceder a esta página.\nTu rol: ${usuario.rol}\nRoles permitidos: ${to.meta.roles.join(', ')}`);
          next('/');
          return;
        }
        
        console.log('✅ Acceso permitido al dashboard');
      } catch (error) {
        console.error('❌ Error al verificar roles:', error);
        next('/login');
        return;
      }
    }

    next();
  } else {
    next();
  }
});

export default router;