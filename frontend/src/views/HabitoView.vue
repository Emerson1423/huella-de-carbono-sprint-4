<template>
  <NavComponente></NavComponente>
  <br>
  <div>
    <HabitosComponente />
  </div>
</template>

<script>
import HabitosComponente from '../components/HabitosComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
export default {
  name: 'HabitosView',
  components: {
    HabitosComponente,
    NavComponente
  }
}
</script>