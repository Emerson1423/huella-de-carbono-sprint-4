<template>
    <navComponente/>
    <br>
    <br>
    <br>
    <videosComponente/>
    <footerComponente/>
    

</template>
<script>
import videosComponente from '@/components/videosComponente.vue';
import navComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';

export default{
    components:{
        videosComponente,
        navComponente,
        footerComponente
    }
}
</script>