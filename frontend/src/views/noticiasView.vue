<template>
  <nav-componente />
    <br>
    <br>
    <br>
  <api-noticias-componente />
</template>

<script>
import apiNoticiasComponente from '../components/apiNoticiasComponente.vue';
import navComponente from '@/components/NavComponente.vue';
export default {
  components: { apiNoticiasComponente, navComponente    }
};
</script>