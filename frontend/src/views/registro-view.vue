<template>

<NavComponente></NavComponente>

<registroComponente></registroComponente>


</template>
    
<script>

import RegistroComponente from '../components/registroComponente.vue';
import NavComponente from '../components/NavComponente.vue';

export default {
    
    components: {
        RegistroComponente,
        NavComponente// Registra el componente aquí
       
    },
}
</script>