<script lang="ts">
import type { ControlPosition, ScaleControlOptions } from 'mapbox-gl';
interface ScaleControlProps {
	position?: ControlPosition;
	maxWidth?: ScaleControlOptions['maxWidth'];
	unit?: ScaleControlOptions['unit'];
}
</script>
<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey';
import { useScaleControl } from '@/hooks/control/useScaleControl';
import { inject, ref } from 'vue-demi';

const props = defineProps<ScaleControlProps>();

const mapInstance = inject(MapProvideKey, ref(null));
useScaleControl({
	map: mapInstance,
	...props,
});
</script>
<template></template>
