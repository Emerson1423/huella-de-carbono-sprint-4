<template>
    <div>
        <NavComponente/>
        <eventoscomponente/>
        <footerComponente/>
    </div>
  

</template>

<script>

import eventoscomponente from '@/components/apiEventosComponente.vue';
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';


export default{
    components:{
        eventoscomponente,
        NavComponente,
        footerComponente
       
    }
}

</script>