<template>
<NavComponente></NavComponente>
    <br>
    <br>
    <br>
    <br>
    <br>
<curiosidadesComponente/>
<footerComponente/>
</template>
<script>

import curiosidadesComponente from '@/components/curiosidadesComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';


export default{
    components:{
        curiosidadesComponente,
        NavComponente,
        footerComponente
       
    }
}

</script>