import { ref, unref, shallowRef, computed, onUnmounted } from 'vue-demi'
import type { ShallowRef } from 'vue-demi'
import type { Map, CanvasSource, CanvasSourceOptions, MapSourceDataEvent } from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from "@/hooks/event/useMapReloadEvent";
import { getShallowRef } from '@/helpers/getRef';
import { MapboxSourceType } from '@/enums/MapboxSourceEnum';
import { hasSource } from '@/helpers/mapUtils';
import type { Nullable, ShallowRefOrNo } from '@/types';

interface CreateImageSourceProps {
  map: ShallowRefOrNo<Nullable<Map>>;
  id?: string;
  canvas?: string | HTMLCanvasElement;
  animate?: boolean;
  coordinates?: CanvasSourceOptions["coordinates"];
  register?: (actions: CreateImageSourceActions, map: Map) => void;
}

interface CreateImageSourceActions {
  sourceId: string;
  setPlay: (isPlay: boolean) => void
  getSource: ShallowRef<Nullable<CanvasSource>>;
  getCanvas: () => HTMLCanvasElement | undefined;
  setCoordinates: (coordinates: Required<CanvasSourceOptions>["coordinates"]) => void;
}

export function useCreateCanvasSource({
  map,
  id,
  register,
  animate = false,
  canvas: canvasVal,
  coordinates: coordinatesVal,
}: CreateImageSourceProps) {
  const mapInstance = getShallowRef(map)
  const sourceType = MapboxSourceType.Canvas
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<CanvasSource>>(null);
  const coordinates = ref<CanvasSourceOptions["coordinates"] | undefined>(coordinatesVal);
  const getSource = computed(() => source.value)

  useMapReloadEvent(mapInstance, {
    unLoad: removeSource,
    onLoad: createSource,
  })

  function sourcedataEventFn(e: MapSourceDataEvent) {
    if (!source.value && e.dataType === e.dataType && e.sourceId === sourceId && e.isSourceLoaded) {
      source.value = mapInstance.value!.getSource(sourceId) as CanvasSource;
      register?.({
        sourceId,
        setPlay,
        getSource,
        setCoordinates,
        getCanvas
      }, mapInstance.value!)
      mapInstance.value!.off('sourcedata', sourcedataEventFn)
    }
  }

  function createSource() {
    const map = unref(mapInstance.value);
    if (!canvasVal) {
      canvasVal = document.createElement('canvas');
    }
    if (!source.value && map && canvasVal && coordinates.value?.length) {
      map.addSource(sourceId, {
        type: sourceType,
        canvas: canvasVal,
        animate,
        coordinates: coordinates.value,
      });
      map.on('sourcedata', sourcedataEventFn)
    }
  }

  function setCoordinates(coordinatesVal: Required<CanvasSourceOptions>["coordinates"]) {
    if (coordinatesVal.length) {
      coordinates.value = coordinatesVal
    }
    if (!source.value) {
      createSource()
      return
    }
    coordinates.value && source.value.setCoordinates(coordinatesVal);
  }

  function setPlay(playVal: boolean) {
    if (source.value) {
      if (playVal) {
        (source.value as any).play()
      } else {
        (source.value as any).pause()
      }
    }
  }

  function getCanvas() {
    return source.value?.getCanvas()
  }

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
    setPlay,
    getCanvas,
    getSource,
    setCoordinates,
    removeSource,
  }
}