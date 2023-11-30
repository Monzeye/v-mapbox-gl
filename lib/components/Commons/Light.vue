<script lang="ts">
import type { Light } from 'mapbox-gl';
interface LightProps {
	options?: Light;
}
</script>
<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey';
import { inject, ref, watch } from 'vue-demi';
import { useCreateLight } from '@/hooks/mapbox/useCreateLight';

const props = defineProps<LightProps>();

const mapInstance = inject(MapProvideKey, ref(null));

const { setLight } = useCreateLight({
	map: mapInstance,
	options: props.options,
});

watch(
	() => props.options,
	(options) => {
		setLight(options ?? {});
	}
);
</script>
<template></template>
