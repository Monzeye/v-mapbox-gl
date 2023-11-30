import { unref, shallowRef, computed, onUnmounted } from 'vue-demi'
import type { ShallowRef } from 'vue-demi'
import type { Map, GeoJSONSource, GeoJSONSourceOptions, MapSourceDataEvent } from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent';
import { getShallowRef } from '@/helpers/getRef';
import { MapboxSourceType } from '@/enums/MapboxSourceEnum';
import { hasSource } from '@/helpers/mapUtils';
import type { Nullable, ShallowRefOrNo } from '@/types';

interface CreateGeoJsonSourceProps {
  map: ShallowRefOrNo<Nullable<Map>>;
  id?: string;
  data?: GeoJSONSourceOptions['data'];
  options?: Partial<GeoJSONSourceOptions>;
  register?: (actions: CreateGeoJsonSourceActions, map: Map) => void;
}

export interface CreateGeoJsonSourceActions {
  sourceId: string;
  getSource: ShallowRef<Nullable<GeoJSONSource>>;
  setData: (data: GeoJSONSourceOptions['data']) => void;
}

const defaultData: GeoJSONSourceOptions['data'] = {
  type: 'FeatureCollection',
  features: []
}

export function useCreateGeoJsonSource({
  map,
  id,
  register,
  options = {},
  data = defaultData
}: CreateGeoJsonSourceProps) {
  const mapInstance = getShallowRef(map)
  const sourceId = getNanoid(id)
  const sourceType = MapboxSourceType.Geojson
  const source = shallowRef<Nullable<GeoJSONSource>>(null);
  const getSource = computed(() => source.value)

  useMapReloadEvent(mapInstance, {
    unLoad: removeSource,
    onLoad: initSource
  })

  function sourcedataEventFn(e: MapSourceDataEvent) {
    if (!source.value && e.dataType === e.dataType && e.sourceId === sourceId && e.isSourceLoaded) {
      source.value = mapInstance.value!.getSource(sourceId) as GeoJSONSource;
      register?.({
        sourceId,
        getSource,
        setData
      }, mapInstance.value!)
      mapInstance.value!.off('sourcedata', sourcedataEventFn)
    }
  }

  function initSource() {
    const map = unref(mapInstance.value);
    if (map && !source.value && !hasSource(map, sourceId)) {
      map.addSource(sourceId, {
        ...options,
        type: sourceType,
        data,
      });
      map.on('sourcedata', sourcedataEventFn)
    }
  }
  function setData(dataVal: GeoJSONSourceOptions['data']) {
    if (mapInstance.value && source.value && hasSource(mapInstance.value, sourceId)) {
      dataVal && source.value.setData(dataVal)
    }
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
    getSource,
    setData,
    removeSource,
  }
}