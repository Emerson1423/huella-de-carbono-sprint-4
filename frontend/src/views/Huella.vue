<template>

  <NavComponente></NavComponente>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div>
  <HuellaComponente></HuellaComponente>
   </div>

</template>

<script>
import HuellaComponente from '../components/huellaComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
export default {
  name: 'App',
  components: {
    HuellaComponente, // Registra el componente aquí
    NavComponente

  }
}

</script>