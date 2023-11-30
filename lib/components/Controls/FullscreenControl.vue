<script lang="ts">
import type { ControlPosition } from 'mapbox-gl';
interface FullscreenControlProps {
	container?: HTMLElement | string;
	position?: ControlPosition;
}
</script>
<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey';
import { useFullscreenControl } from '@/hooks/control/useFullscreenControl';
import { inject, ref } from 'vue-demi';

const props = defineProps<FullscreenControlProps>();

const mapInstance = inject(MapProvideKey, ref(null));
useFullscreenControl({
	map: mapInstance,
	...props,
});
</script>
<template></template>
