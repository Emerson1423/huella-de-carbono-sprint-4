<template>
    <NavComponente></NavComponente>
    <reciclaComponent></reciclaComponent>
    <footerComponente></footerComponente>


 

</template>

<script>

import reciclaComponent from '@/components/reciclaComponent.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';



export default {
    components:
    {
        reciclaComponent,
        NavComponente,
        footerComponente
        
    }
}

</script>