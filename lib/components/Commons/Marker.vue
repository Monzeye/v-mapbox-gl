<script lang="ts">
import type { LngLatLike, MarkerOptions, Popup } from 'mapbox-gl';
interface MarkerProps extends MarkerOptions {
	lnglat?: LngLatLike;
	popup?: Popup;
	options?: MarkerOptions;
	draggable?: boolean;
}
</script>
<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey';
import { useCreateMarker } from '@/hooks/mapbox/useCreateMarker';
import { inject, ref, watch } from 'vue-demi';

const props = withDefaults(defineProps<MarkerProps>(), {
	options: () => ({}),
});
const emit = defineEmits<{
	(e: 'dragstart', ev: Event): void;
	(e: 'drag', ev: Event): void;
	(e: 'dragend', ev: Event): void;
}>();
const mapInstance = inject(MapProvideKey, ref(null));
const markerElRef = ref<HTMLElement>();
const { setDraggable, setLngLat } = useCreateMarker({
	map: mapInstance,
	el: markerElRef,
	lnglat: props.lnglat,
	popup: props.popup,
	options: {
		...props.options,
		...(props.draggable === undefined
			? {}
			: {
					draggable: props.draggable,
			  }),
	},
	on: {
		dragstart: (ev) => emit('dragstart', ev),
		drag: (ev) => emit('drag', ev),
		dragend: (ev) => emit('dragend', ev),
	},
});

watch(
	() => props.lnglat,
	(lnglat) => {
		lnglat && setLngLat(lnglat);
	}
);

watch(() => props.draggable, setDraggable);
</script>
<template>
	<div ref="markerElRef">
		<slot></slot>
	</div>
</template>
