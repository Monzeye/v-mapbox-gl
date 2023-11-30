<script lang="ts">
import type { ImageSourceOptions } from 'mapbox-gl';
interface ImageSourceProps {
	id?: string;
	url?: ImageSourceOptions['url'];
	coordinates?: ImageSourceOptions['coordinates'];
}
</script>
<script lang="ts" setup>
import { inject, computed, watch, provide } from 'vue-demi';
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey';
import { useCreateImageSource } from '@/hooks/sources/useCreateImageSource';

const props = withDefaults(defineProps<ImageSourceProps>(), {
	coordinates: () => [],
});

const imageSourceOptions = computed(() => {
	return {
		url: props.url,
		coordinates: props.coordinates,
	};
});

const mapInstance = inject(MapProvideKey)!;
if (mapInstance.value) {
	const { updateSource, getSource } = useCreateImageSource({
		map: mapInstance,
		id: props.id,
		url: props.url,
		coordinates: props.coordinates,
	});
	provide(SourceProvideKey, getSource);

	watch(imageSourceOptions, updateSource, {
		deep: true,
		immediate: true,
	});
}
</script>
<template>
	<slot></slot>
</template>
