<template>
<NavComponente/>
    <br>
    <br>
    <br>

<articulosComponente/>
<footerComponente></footerComponente>
</template>

<script>
import articulosComponente from '@/components/articulosComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';

export default{
    components:{
        articulosComponente,
        NavComponente,
        footerComponente
        
    }
}
</script>