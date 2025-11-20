<template>
    <NavComponente></NavComponente>

    <plantaGameComponent></plantaGameComponent>
    <footerComponente></footerComponente>


 

</template>

<script>

import plantaGameComponent from '@/components/plantaGameComponent.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';



export default {
    components:
    {
        plantaGameComponent,
        NavComponente,
        footerComponente
        
    }
}

</script>