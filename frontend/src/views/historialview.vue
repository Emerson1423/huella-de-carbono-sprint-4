<template>
<NavComponente></NavComponente>

<historialComponete></historialComponete>
</template>

<script>
import HistorialComponete from '../components/historialComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
export default {
    name: 'app',
    components: {
        HistorialComponete, // Registra el componente aquí
        NavComponente
    },
}

</script>