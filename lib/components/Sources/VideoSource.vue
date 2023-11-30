<script lang="ts">
import type { VideoSourceOptions } from 'mapbox-gl';
interface VideoSourceProps {
	id?: string;
	urls: string[];
	coordinates?: VideoSourceOptions['coordinates'];
}
</script>
<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue-demi';
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey';
import { useCreateVideoSource } from '@/hooks/sources/useCreateVideoSource';

const props = withDefaults(defineProps<VideoSourceProps>(), {
	coordinates: () => [],
});
const mapInstance = inject(MapProvideKey, ref(null));
const { setCoordinates, getSource } = useCreateVideoSource({
	map: mapInstance,
	id: props.id,
	urls: props.urls,
	coordinates: props.coordinates,
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
