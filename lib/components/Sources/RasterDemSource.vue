<script lang="ts">
import type { RasterDemSourceOptions } from "mapbox-gl";
interface RasterDemSourceProps {
  url?: string;
  tiles?: string[];
  id?: string;
  options?: Partial<RasterDemSourceOptions>;
}
</script>
<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue-demi';
import { MapProvideKey, SourceProvideKey } from "@/enums/MapProvideKey";
import { useCreateRasterDemSource } from "@/hooks/sources/useCreateRasterDemSource";

const props = defineProps<RasterDemSourceProps>();
const mapInstance = inject(MapProvideKey, ref(null));
const { getSource, setTiles, setUrl } = useCreateRasterDemSource({
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
