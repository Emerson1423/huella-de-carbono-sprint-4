<template>
  <nav-componente />
    <br>
    <br>
    <br>
  <api-noticias-componente />
  <footerComponente></footerComponente>
</template>

<script>
import apiNoticiasComponente from '../components/apiNoticiasComponente.vue';
import navComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';
export default {
  components: { apiNoticiasComponente, navComponente, footerComponente    }
};
</script>