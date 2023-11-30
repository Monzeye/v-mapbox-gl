<script lang="ts">
import type { RasterSourceOptions } from 'mapbox-gl';
interface RasterSourceProps {
	url?: string;
	tiles?: string[];
	id?: string;
	options?: Partial<RasterSourceOptions>;
}
</script>
<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue-demi';
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey';
import { useCreateRasterSource } from '@/hooks/sources/useCreateRasterSource';

const props = defineProps<RasterSourceProps>();
const mapInstance = inject(MapProvideKey, ref(null));
const { getSource, setTiles, setUrl } = useCreateRasterSource({
	map: mapInstance,
	id: props.id,
	url: props.url,
	tiles: props.tiles,
	options: props.options,
});
provide(SourceProvideKey, getSource);

watch(() => props.url, setUrl);

watch(() => props.tiles, setTiles, {
	deep: true,
	immediate: true,
});
</script>
<template>
	<slot></slot>
</template>
