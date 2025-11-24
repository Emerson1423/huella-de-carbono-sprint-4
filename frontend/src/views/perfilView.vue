<template>
    <NavComponente></NavComponente>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <perfilComponente></perfilComponente>
    <br>
    <footerComponente></footerComponente>
</template>

<script>
import perfilComponente from '@/components/perfilComponente.vue'
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';

export default {
    components: {
        perfilComponente,
        NavComponente,
        footerComponente
    }
}
</script>
