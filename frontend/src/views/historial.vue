<template>
<NavComponente></NavComponente>
<ResultadosComponente></ResultadosComponente>
</template>

<script>
import ResultadosComponente from '../components/resultadosComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
export default {
    name: 'app',
    components: {
        ResultadosComponente, // Registra el componente aquí
        NavComponente
    },
}

</script>