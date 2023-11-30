<script lang="ts">
import type {
	MapboxEvent,
	MapboxOptions,
	MapBoxZoomEvent,
	MapContextEvent,
	MapDataEvent,
	// MapEventTypes,
	MapMouseEvent,
	MapSourceDataEvent,
	MapStyleDataEvent,
	MapTouchEvent,
	MapWheelEvent,
} from 'mapbox-gl';
import type { CreateMapboxActions } from '@/hooks/mapbox/useCreateMapbox';
interface MapboxProps {
	width?: string;
	height?: string;
	showStats?: boolean;
	options?: Partial<MapboxOptions>;
}
</script>
<script lang="ts" setup>
import { onMounted, ref, provide, onUnmounted } from 'vue-demi';
import { MapProvideKey } from '@/enums/MapProvideKey';
import { MapboxEvents, MapboxStatus } from '@/enums/MapboxEnum';
import { watch, nextTick } from 'vue-demi';
import Stats from 'stats.js';
import { useCreateMapbox } from '@/hooks/mapbox/useCreateMapbox';

const props = withDefaults(defineProps<MapboxProps>(), {
	width: '100%',
	height: '100%',
	showStats: false,
	options: () => ({} as Partial<MapboxOptions>),
});

const emit = defineEmits<{
	(e: 'register', mapboxComponentAction: CreateMapboxActions): void;
	(e: 'error', ev: ErrorEvent): void;
	(e: 'load', ev: MapboxEvent): void;
	(e: 'idle', ev: MapboxEvent): void;
	(e: 'remove', ev: MapboxEvent): void;
	(e: 'render', ev: MapboxEvent): void;
	(e: 'resize', ev: MapboxEvent): void;
	(e: 'webglcontextlost', ev: MapContextEvent): void;
	(e: 'webglcontextrestored', ev: MapContextEvent): void;
	(e: 'dataloading', ev: MapDataEvent): void;
	(e: 'data', ev: MapDataEvent): void;
	(e: 'tiledataloading', ev: MapDataEvent): void;
	(e: 'sourcedataloading', ev: MapSourceDataEvent): void;
	(e: 'styledataloading', ev: MapStyleDataEvent): void;
	(e: 'sourcedata', ev: MapSourceDataEvent): void;
	(e: 'styledata', ev: MapStyleDataEvent): void;
	(e: 'boxzoomcancel', ev: MapBoxZoomEvent): void;
	(e: 'boxzoomstart', ev: MapBoxZoomEvent): void;
	(e: 'boxzoomend', ev: MapBoxZoomEvent): void;
	(e: 'touchcancel', ev: MapTouchEvent): void;
	(e: 'touchmove', ev: MapTouchEvent): void;
	(e: 'touchend', ev: MapTouchEvent): void;
	(e: 'touchstart', ev: MapTouchEvent): void;
	(e: 'click', ev: MapMouseEvent): void;
	(e: 'contextmenu', ev: MapMouseEvent): void;
	(e: 'dblclick', ev: MapMouseEvent): void;
	(e: 'mousemove', ev: MapMouseEvent): void;
	(e: 'mouseup', ev: MapMouseEvent): void;
	(e: 'mousedown', ev: MapMouseEvent): void;
	(e: 'mouseout', ev: MapMouseEvent): void;
	(e: 'mouseover', ev: MapMouseEvent): void;
	(e: 'movestart', ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>): void;
	(e: 'move', ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>): void;
	(e: 'moveend', ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>): void;
	(e: 'zoomstart', ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>): void;
	(e: 'zoom', ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>): void;
	(e: 'zoomend', ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>): void;
	(e: 'rotatestart', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'rotate', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'rotateend', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'dragstart', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'drag', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'dragend', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'pitchstart', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'pitch', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'pitchend', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void;
	(e: 'wheel', ev: MapWheelEvent): void;
}>();

const statsElRef = ref<HTMLElement>(undefined!);
const mapboxElRef = ref<HTMLElement>(undefined!);

const {
	getMapInstance,
	getMapStatus,
	setCenter,
	setBearing,
	setZoom,
	setPitch,
	setStyle,
	setMaxBounds,
	setMaxPitch,
	setMaxZoom,
	setMinPitch,
	setMinZoom,
	setProjection,
	setRenderWorldCopies,
} = useCreateMapbox(mapboxElRef, {
	...props.options,
	register: (actions: CreateMapboxActions) => {
		emit('register', actions);
	},
});

MapboxEvents.forEach((event) => {
	getMapInstance.value?.on(event, (ev) => {
		emit(event as any, ev);
	});
});

provide(MapProvideKey, getMapInstance);
let animationFrame: number;
let stats: Stats;
function initStats() {
	nextTick(() => {
		if (statsElRef.value) {
			stats = new Stats();
			stats.showPanel(0);
			statsElRef.value.appendChild(stats.dom);
			// eslint-disable-next-line no-inner-declarations
			function animate() {
				stats.begin();
				stats.end();
				animationFrame = requestAnimationFrame(animate);
			}
			animationFrame = requestAnimationFrame(animate);
		}
	});
}

onMounted(() => {
	props.showStats && initStats();
});
onUnmounted(() => {
	animationFrame && cancelAnimationFrame(animationFrame);
	animationFrame = undefined!;
	stats = null!;
});

watch(() => props.options.center, setCenter);
watch(() => props.options.bearing, setBearing);
watch(() => props.options.zoom, setZoom);
watch(() => props.options.pitch, setPitch);
watch(() => props.options.style, setStyle);
watch(() => props.options.maxBounds, setMaxBounds);
watch(() => props.options.maxPitch, setMaxPitch);
watch(() => props.options.maxZoom, setMaxZoom);
watch(() => props.options.minPitch, setMinPitch);
watch(() => props.options.minZoom, setMinZoom);
watch(() => props.options.projection, setProjection);
watch(() => props.options.renderWorldCopies, setRenderWorldCopies);
</script>
<style lang="css">
.mapbox_wrapper .mapbox_container {
	width: 100%;
	height: 100%;
}
</style>
<template>
	<div
		class="mapbox_wrapper"
		:style="{
			width: props.width,
			height: props.height,
		}"
	>
		<div class="mapbox_container" ref="mapboxElRef"></div>
		<slot name="beforeLoad" v-if="getMapStatus >= MapboxStatus.Loading"></slot>
		<slot v-if="getMapStatus >= MapboxStatus.Loaded"></slot>
		<div ref="statsElRef" v-if="props.showStats"></div>
	</div>
</template>
