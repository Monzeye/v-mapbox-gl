import { ref, unref, shallowRef, computed, onUnmounted } from 'vue-demi'
import type { ShallowRef } from 'vue-demi'
import type { Map, MapSourceDataEvent, RasterSource, RasterSourceOptions } from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from "@/hooks/event/useMapReloadEvent";
import { MapboxSourceType } from '@/enums/MapboxSourceEnum';
import { hasSource } from '@/helpers/mapUtils';
import { getShallowRef } from '@/helpers/getRef';
import type { Nullable, ShallowRefOrNo } from '@/types';

interface CreateRasterSourceProps {
  map: ShallowRefOrNo<Nullable<Map>>;
  url?: string;
  tiles?: string[];
  id?: string;
  options?: Partial<RasterSourceOptions>;
  register?: (actions: CreateRasterSourceActions, map: Map) => void;
}

interface CreateRasterSourceActions {
  sourceId: string;
  getSource: ShallowRef<Nullable<RasterSource>>;
  setUrl: (url: string) => void;
  setTiles: (tiles: string[]) => void;
  reload: () => void;
}

export function useCreateRasterSource({
  map,
  id,
  register,
  url: urlVal,
  tiles: tilesVal,
  options: optionsVal = {},
}: CreateRasterSourceProps) {
  const mapInstance = getShallowRef(map)
  const sourceType = MapboxSourceType.Raster
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<RasterSource>>(null);
  const getSource = computed(() => source.value)
  const url = ref<string>(urlVal ?? '');
  const tiles = ref<string[]>(tilesVal ?? []);

  function sourcedataEventFn(e: MapSourceDataEvent) {
    if (!source.value && e.dataType === e.dataType && e.sourceId === sourceId && e.isSourceLoaded) {
      source.value = mapInstance.value!.getSource(sourceId) as RasterSource;
      register?.({
        sourceId,
        getSource,
        setUrl,
        setTiles,
        reload
      }, mapInstance.value!)
      mapInstance.value!.off('sourcedata', sourcedataEventFn)
    }
  }

  function initRasterSource() {
    const map = unref(mapInstance.value);
    if (!source.value && map && !hasSource(map, sourceId) && (url.value || tiles.value.length)) {
      map.addSource(sourceId, {
        ...optionsVal,
        type: sourceType,
        url: url.value,
        tiles: tiles.value,
      });
      map.on('sourcedata', sourcedataEventFn)

    }
  }

  function setUrl(urlVal = '') {
    url.value = urlVal;
    if (!source.value) {
      initRasterSource()
      return
    }
    urlVal && (source.value as any).setUrl(urlVal);
  }
  function setTiles(tilesVal?: string[]) {
    tiles.value = tilesVal ? tilesVal : [];
    if (!source.value) {
      initRasterSource()
      return
    }
    tiles.value.length && (source.value as any).setTiles(tilesVal);
  }
  function reload() {
    (source.value as any)?.reload();
  }
  useMapReloadEvent(mapInstance, {
    unLoad: removeSource,
    onLoad: initRasterSource
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
    setUrl,
    setTiles,
    reload,
    removeSource,
  }
}