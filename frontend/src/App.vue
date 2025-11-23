<template>
  <div id="app-root">
    <router-view/>
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
      } catch (e) {
        return false;
      }
    }
  }
}
</script>