<script lang="ts">
import type {
	Expression,
	SymbolLayout,
	SymbolPaint,
	//  MapLayerEventType,
	MapLayerMouseEvent,
	MapLayerTouchEvent,
	SymbolLayer,
	AnyLayout,
	Map,
} from 'mapbox-gl';
import type { CreateLayerActions } from '@/index';
interface LayerProps {
	id?: string;
	filter?: Expression;
	style?: SymbolLayout & SymbolPaint;
	maxzoom?: number;
	minzoom?: number;
	metadata?: object;
	source?: string | object;
	sourceLayer?: string;
	beforeId?: string;
	visible?: boolean;
}
</script>
<script lang="ts" setup>
import { ref, inject, watch } from 'vue-demi';
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey';
import { useCreateSymbolLayer } from '@/hooks/layers/useCreateSymbolLayer';
import { useLayerEventListener } from '@/hooks/event/useLayerEventListener';
import { MapboxLayerEvents } from '@/enums/MapboxLayerEnum';

const props = withDefaults(defineProps<LayerProps>(), {
	visible: undefined,
});
const emit = defineEmits<{
	(e: 'register', actions: CreateLayerActions<SymbolLayer>, map: Map): any;
	(e: 'click', ev: MapLayerMouseEvent): any;
	(e: 'dblclick', ev: MapLayerMouseEvent): any;
	(e: 'mousedown', ev: MapLayerMouseEvent): any;
	(e: 'mouseup', ev: MapLayerMouseEvent): any;
	(e: 'mousemove', ev: MapLayerMouseEvent): any;
	(e: 'mouseenter', ev: MapLayerMouseEvent): any;
	(e: 'mouseleave', ev: MapLayerMouseEvent): any;
	(e: 'mouseover', ev: MapLayerMouseEvent): any;
	(e: 'mouseout', ev: MapLayerMouseEvent): any;
	(e: 'contextmenu', ev: MapLayerMouseEvent): any;
	(e: 'touchstart', ev: MapLayerTouchEvent): any;
	(e: 'touchend', ev: MapLayerTouchEvent): any;
	(e: 'touchcancel', ev: MapLayerTouchEvent): any;
}>();
const source = inject(SourceProvideKey, ref(null));
const mapInstance = inject(MapProvideKey, ref(null));
const visibleStyle: AnyLayout = {};
if (props.visible !== undefined) {
	visibleStyle['visibility'] = props.visible ? 'visible' : 'none';
}
const { getLayer, setBeforeId, setFilter, setStyle, setZoomRange, setLayoutProperty } = useCreateSymbolLayer({
	map: mapInstance,
	source: props.source || source,
	style: { ...props.style, ...visibleStyle },
	filter: props.filter,
	id: props.id,
	maxzoom: props.maxzoom,
	minzoom: props.minzoom,
	metadata: props.metadata,
	sourceLayer: props.sourceLayer,
	register: (actions, map) => {
		emit('register', actions, map);
	},
});
MapboxLayerEvents.map((eventName) => {
	useLayerEventListener({
		map: mapInstance,
		layer: getLayer,
		event: eventName,
		on: (data) => {
			emit(eventName as any, data as any);
		},
	});
});
watch(() => props.filter, setFilter);
watch(() => props.style, setStyle);
watch(() => props.maxzoom, setZoomRange);
watch(() => props.minzoom, setZoomRange);
watch(() => props.beforeId, setBeforeId);
watch(
	() => props.visible,
	(visible) => {
		setLayoutProperty('visibility', visible ? 'visible' : 'none');
	}
);
</script>
<template></template>
