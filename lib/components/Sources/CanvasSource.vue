<script lang="ts">
import type { CanvasSourceOptions } from 'mapbox-gl';
interface CanvasSourceProps {
	id?: string;
	canvas?: string | HTMLCanvasElement;
	coordinates?: CanvasSourceOptions['coordinates'];
	animate?: boolean;
}
</script>
<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue-demi';
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey';
import { useCreateCanvasSource } from '@/hooks/sources/useCreateCanvasSource';

const props = withDefaults(defineProps<CanvasSourceProps>(), {
	coordinates: () => [],
	animate: true,
});
const mapInstance = inject(MapProvideKey, ref(null));

const { setCoordinates, getSource } = useCreateCanvasSource({
	map: mapInstance,
	id: props.id,
	canvas: props.canvas,
	animate: props.animate,
	coordinates: props.coordinates,
	// register:
});
provide(SourceProvideKey, getSource);
watch(() => props.coordinates, setCoordinates, {
	deep: true,
	immediate: true,
});
</script>
<template>
	<slot></slot>
</template>
