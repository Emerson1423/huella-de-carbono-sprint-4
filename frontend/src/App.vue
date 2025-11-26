<template>
  <div id="app-root">
    <!-- Usamos Suspense para mostrar un fallback mientras las vistas lazy-loaded se cargan.
         Así evitamos que el footer u otros elementos parciales aparezcan antes que el contenido.
    -->
    <Suspense>
      <template #default>
        <router-view />
      </template>

      <template #fallback>
        <div class="route-loading">
          <div class="loader"></div>
        </div>
      </template>
    </Suspense>

    <TourComponente v-if="showHelp" :isAuthenticated="isAuthenticated" />
  </div>
</template>

<script>
import TourComponente from './components/TourComponente.vue';

export default {
  components: {
    TourComponente
  },
  name: 'App',
  computed: {
    showHelp() {
      // Mostrar el botón flotante solo cuando la ruta actual tenga meta.showHelp = true
      return this.$route && this.$route.meta && this.$route.meta.showHelp === true;
    },
    isAuthenticated() {
      try {
        return !!localStorage.getItem('token') && !!localStorage.getItem('usuario');
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return false;
      }
    }
  }
}
</script>

<style scoped>
.route-loading {
  min-height: 60vh; /* reservar espacio para evitar que el footer suba demasiado */
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 6px solid rgba(0,0,0,0.08);
  border-top-color: #2f7a2f;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>