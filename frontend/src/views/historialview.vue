<template>
<NavComponente></NavComponente>

<historialComponete></historialComponete>
<footerComponente/>
</template>

<script>
import HistorialComponete from '../components/historialComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';
export default {
    name: 'app',
    components: {
        HistorialComponete, // Registra el componente aquí
        NavComponente,
        footerComponente
    },
}

</script>