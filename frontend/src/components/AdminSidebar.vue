<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Admin Panel</h2>
      <p class="user-info">{{ usuario.usuario }}</p>
      <span class="rol-badge" :class="usuario.rol">{{ usuario.rol }}</span>
    </div>

    <nav class="sidebar-nav">
      <button 
        v-for="item in menuItems" 
        :key="item.id"
        @click="$emit('cambiar-seccion', item.id)"
        :class="['nav-item', { active: seccionActual === item.id }]"
      >
        <img :src="item.icon" :alt="item.label" class="nav-icon" />
        <span class="nav-text">{{ item.label }}</span>
      </button>
    </nav>

    <button @click="$emit('cerrar-sesion')" class="btn-logout">
      Cerrar Sesión
    </button>
  </aside>
</template>

<script>
import dashboardIcono from '@/assets/icons/dashboard.png'
import preguntasIcono from '@/assets/icons/preguntas.png'
import eventosIcono from '@/assets/icons/eventos.png'
import usuariosIcono from '@/assets/icons/usuarios.png'
export default {
  name: 'AdminSidebar',
  props: {
    usuario: {
      type: Object,
      required: true
    },
    seccionActual: {
      type: String,
      default: 'dashboard'
    }
  },
  emits: ['cambiar-seccion', 'cerrar-sesion'],
  computed: {
    esAdmin() {
      return this.usuario.rol === 'admin';
    },
    esMod() {
      return this.usuario.rol === 'moderador';
    },
    menuItems() {
      const items = [
        { id: 'dashboard', icon: dashboardIcono, label: 'Dashboard' },
        { id: 'preguntas', icon: preguntasIcono, label: 'Preguntas' }
      ];
      
      if (this.esAdmin || this.esMod) {
        items.push({ id: 'eventos', icon: eventosIcono, label: 'Eventos' });
      }
      
      if (this.esAdmin) {
        items.push({ id: 'usuarios', icon: usuariosIcono, label: 'Usuarios' });
      }
      
      return items;
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color:#4caf50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: white;
}

.user-info {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.rol-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.rol-badge.admin {
  background: #e74c3c;
}

.rol-badge.mod {
  background: #f39c12;
}

.rol-badge.usuario {
  background: #3498db;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255,255,255,0.15);
  color: white;
  border-left: 3px solid #3498db;
}

.nav-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;


}

.btn-logout {
  margin: 1rem;
  padding: 1rem;
  background: rgb(255, 25, 0);
  border: 1px solid #e74c3c;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #bc5349;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
}
</style>