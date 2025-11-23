<template>
	<div>
		<NavComponente />
		<manual-componente />
	</div>
</template>

<script>
import NavComponente from '@/components/NavComponente.vue';
import ManualComponente from '@/components/manualComponente.vue';

export default {
	name: 'ManualUser',
	components: {
		NavComponente,
		ManualComponente
	}
};
</script>