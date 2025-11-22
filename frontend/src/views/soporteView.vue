<template>
<NavComponente></NavComponente>
<soporteComponente></soporteComponente>
<footerComponente/>
</template>

<script>
import soporteComponente from '../components/soporteComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';
export default {
    name: 'app',
    components: {
        soporteComponente, 
        NavComponente,
        footerComponente
    },
}

</script>