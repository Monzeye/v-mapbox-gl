<template>
	<div class="map_wrapper">
		<Mapbox :options="options" :showStats="true" @register="register">
			<Popup>
				<div>Popup</div>
				<template #marker>
					<Marker :lnglat="[-114.26608, 32.7213]"> aslkdh als;dkl</Marker>
				</template>
			</Popup>
		</Mapbox>
	</div>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl';
import { ref } from 'vue';
import { useMapbox } from 'v-mapbox-gl';

const options = ref<Omit<MapboxOptions, 'container'>>({
	zoom: 14,
	center: [-114.26608, 32.7213],
	pitch: 80,
	bearing: 41,
	style: 'mapbox://styles/mapbox/satellite-streets-v12',
});
const { register, getMapInstance } = useMapbox();
</script>
<style lang="css" scoped>
.map_wrapper {
	width: 100%;
	height: 100%;
}
</style>
