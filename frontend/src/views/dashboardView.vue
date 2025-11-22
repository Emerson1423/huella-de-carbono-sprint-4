<!-- AdminPanel.vue - Componente Principal -->
<template>
  <div class="admin-panel">
    <AdminSidebar 
      :usuario="usuario"
      :seccion-actual="seccionActual"
      @cambiar-seccion="seccionActual = $event"
      @cerrar-sesion="cerrarSesion"
    />

    <main class="main-content">
      <component 
        :is="componenteActual" 
        :usuario="usuario"
        :api-url="API_URL"
      />
    </main>
  </div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar.vue';
import DashboardGeneral from '@/components/dashboardComponente.vue';
import GestionEventos from '@/components/eventosFormularioComponente.vue';
import GestionPreguntas from '@/components/soporteModerador.vue';
import GestionUsuarios from '@/components/controlRolesComponente.vue';
export default {
  name: 'AdminPanel',
  components: {
    AdminSidebar,
    DashboardGeneral,
    GestionEventos,
    GestionPreguntas,
    GestionUsuarios,
  },
  data() {
    return {
      usuario: {},
      seccionActual: 'dashboard',
    };
  },
  computed: {
    esAdmin() {
      return this.usuario.rol === 'admin';
    },
    esMod() {
      return this.usuario.rol === 'moderador';
    },
    componenteActual() {
      // Verificar permisos
      if (this.seccionActual === 'usuarios' && !this.esAdmin) {
        return 'AccesoDenegado';
      }
      if (this.seccionActual === 'eventos' && !(this.esAdmin || this.esMod)) {
        return 'AccesoDenegado';
      }

      // Mapear secciones a componentes
      const componentes = {
        'dashboard': 'DashboardGeneral',
        'usuarios': 'GestionUsuarios',
        'eventos': 'GestionEventos',
        'preguntas': 'GestionPreguntas'
      };

      return componentes[this.seccionActual] || 'DashboardGeneral';
    }
  },
  mounted() {
    this.cargarUsuario();
  },
  methods: {
    cargarUsuario() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.usuario = payload;
        } catch (error) {
          console.error('Error al decodificar token:', error);
          this.$router.push('/login');
        }
      } else {
        this.$router.push('/login');
      }
    },
    cerrarSesion() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.admin-panel {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Poppins', -apple-system, sans-serif;
}

.main-content {
  margin-left: 260px;
  flex: 1;
  padding: 2rem;
  max-width: calc(100vw - 260px);
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 220px;
    max-width: calc(100vw - 220px);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    max-width: 100vw;
    padding: 1rem;
  }
}
</style>