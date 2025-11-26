<template>
	<div>
		<NavComponente />
		<manual-componente />
		<footerComponente />
	</div>
</template>

<script>
import NavComponente from '@/components/NavComponente.vue';
import ManualComponente from '@/components/manualComponente.vue';
import footerComponente from '@/components/footerComponente.vue';

export default {
	name: 'ManualUser',
	components: {
		NavComponente,
		ManualComponente,
		footerComponente
	}
};
</script>