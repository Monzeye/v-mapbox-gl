import { ref, unref, shallowRef, computed, onUnmounted } from 'vue-demi'
import type { ShallowRef } from 'vue-demi'
import type { Map, ImageSource, ImageSourceOptions, MapSourceDataEvent } from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent';
import { MapboxSourceType } from '@/enums/MapboxSourceEnum';
import { hasSource } from '@/helpers/mapUtils';
import { getShallowRef } from '@/helpers/getRef';
import type { Nullable, ShallowRefOrNo } from '@/types';

interface CreateImageSourceProps {
  map: ShallowRefOrNo<Nullable<Map>>;
  id?: string;
  url?: string;
  coordinates?: ImageSourceOptions["coordinates"];
  register?: (actions: CreateImageSourceActions, map: Map) => void;
}

interface CreateImageSourceActions {
  sourceId: string;
  getSource: ShallowRef<Nullable<ImageSource>>;
  updateSource: (options: Partial<ImageSourceOptions>) => void;
}

export function useCreateImageSource({
  map,
  id,
  register,
  url: urlVal,
  coordinates: coordinatesVal
}: CreateImageSourceProps) {
  const mapInstance = getShallowRef(map)

  const sourceType = MapboxSourceType.Image
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<ImageSource>>(null);
  const getSource = computed(() => source.value)

  const url = ref(urlVal);
  const coordinates = ref<ImageSourceOptions["coordinates"]>(coordinatesVal);

  function updateImage(options: ImageSourceOptions) {
    if (mapInstance.value && source.value && hasSource(mapInstance.value, sourceId)) {
      source.value.updateImage(options);
    }
  }
  function setCoordinates(coordinates: ImageSourceOptions["coordinates"]) {
    if (mapInstance.value && source.value && hasSource(mapInstance.value, sourceId)) {
      coordinates && source.value.setCoordinates(coordinates);
    }
  }
  function updateSource(options: Partial<ImageSourceOptions>) {
    url.value = options.url ? options.url : ''
    if (options.coordinates) {
      coordinates.value = options.coordinates
    }
    if (!source.value) {
      createSource()
      return
    }
    if (options.url) {
      updateImage(options)
    } else {
      options.coordinates && setCoordinates(options.coordinates)
    }
  }

  function sourcedataEventFn(e: MapSourceDataEvent) {
    if (!source.value && e.dataType === e.dataType && e.sourceId === sourceId && e.isSourceLoaded) {
      source.value = mapInstance.value!.getSource(sourceId) as ImageSource;
      register?.({
        sourceId,
        getSource,
        updateSource
      }, mapInstance.value!)
      mapInstance.value!.off('sourcedata', sourcedataEventFn)
    }
  }

  function createSource() {
    const map = unref(mapInstance.value);
    if (!map) return
    if (!source.value && url.value && coordinates.value?.length && !hasSource(map, sourceId)) {
      map.addSource(sourceId, {
        type: sourceType,
        url: url.value,
        coordinates: coordinates.value,
      });
      map.on('sourcedata', sourcedataEventFn)
    }
  }
  useMapReloadEvent(mapInstance, {
    unLoad: () => {
      removeSource()
    },
    onLoad: () => {
      createSource()
    }
  })

  function removeSource() {
    const map = unref(mapInstance?.value);
    source.value = null
    if (map && hasSource(map, sourceId)) {
      map.removeSource(sourceId);
      map.off('sourcedata', sourcedataEventFn)
    }
  }

  onUnmounted(removeSource)

  return {
    sourceId,
    getSource,
    updateSource,
    removeSource,
  }
}