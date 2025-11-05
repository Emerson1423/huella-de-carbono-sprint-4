<template>
    <div>
        <NavComponente/>
        <eventoscomponente/>
    </div>
  

</template>

<script>

import eventoscomponente from '@/components/apiEventosComponente.vue';
import NavComponente from '@/components/NavComponente.vue';


export default{
    components:{
        eventoscomponente,
        NavComponente
       
    }
}

</script>