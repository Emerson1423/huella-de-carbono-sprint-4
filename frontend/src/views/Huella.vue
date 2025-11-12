<template>

  <NavComponente></NavComponente>
 
  <HuellaComponente></HuellaComponente>
  <br>
   <footerComponente/>

</template>

<script>
import HuellaComponente from '../components/huellaComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';
export default {
  name: 'App',
  components: {
    HuellaComponente, // Registra el componente aquí
    NavComponente,
    footerComponente

  }
}

</script>