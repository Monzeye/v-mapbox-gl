import type {
  MapboxEvent, MapboxOptions, Style,
  LngLatBoundsLike, LngLatLike,
  Projection,
} from 'mapbox-gl'
import { Map } from 'mapbox-gl'
import { nextTick, onUnmounted, ref, shallowRef, computed } from 'vue-demi'
import type { Ref, ShallowRef } from 'vue-demi'
import { MapboxStatus } from '@/enums/MapboxEnum';
import type { Nullable } from '@/types';

interface CreateMapboxProps extends MapboxOptions {
  register?: (actions: CreateMapboxActions) => void;
}

export interface CreateMapboxActions {
  mapInstance: ShallowRef<Nullable<Map>>;
  // props: Omit<CreateMapboxProps, "container">;
  methods: {
    setRenderWorldCopies: (renderWorldCopies: boolean) => void;
    setProjection: (projection: Projection) => void;
    setMinZoom: (zoom: number) => void;
    setMinPitch: (pitch: number) => void;
    setMaxZoom: (zoom: number) => void;
    setMaxPitch: (pitch: number) => void;
    setMaxBounds: (bounds?: LngLatBoundsLike) => void;
    setStyle: (style?: string | Style) => void;
    setPitch: (pitch?: number) => void;
    setZoom: (zoom?: number) => void;
    setBearing: (bearing: number) => void;
    setCenter: (center?: LngLatLike) => void;
  }
}

export function useCreateMapbox(elRef: Ref<HTMLElement>, props: Omit<CreateMapboxProps, 'container'> = {}) {
  const mapInstance = shallowRef<Nullable<Map>>(null);
  const mapStatus = ref<MapboxStatus>(MapboxStatus.NotLoaded);
  props.center = props.center ?? [0, 0];
  props.bearing = props.bearing ?? 0;
  props.zoom = props.zoom ?? 0;
  props.pitch = props.pitch ?? 0;
  props.style = props.style ?? "mapbox://styles/mapbox/streets-v11";
  props.maxPitch = props.maxPitch ?? 85;
  props.maxZoom = props.maxZoom ?? 22;
  props.minPitch = props.minPitch ?? 0;
  props.minZoom = props.minZoom ?? 0;
  props.renderWorldCopies = props.renderWorldCopies ?? true;

  function initMap() {
    if (!mapInstance.value && elRef.value) {
      const { register, ...options } = props;
      mapStatus.value = MapboxStatus.NotLoaded;
      mapInstance.value = new Map({
        attributionControl: false,
        ...options,
        container: elRef.value,
      });
      mapStatus.value = MapboxStatus.Loading;
      register && register({
        mapInstance,
        methods
      });
      mapInstance.value.on("load", mapEventLoad);
      mapInstance.value.on("error", mapEventError);
    }
  }

  function mapEventLoad() {
    mapStatus.value = MapboxStatus.Loaded;
  }
  function mapEventError(ev: MapboxEvent) {
    console.warn("map error", ev);
  }
  function setCenter(centerVal?: LngLatLike) {
    centerVal = centerVal ?? mapInstance.value?.getCenter();
    props.center = centerVal
    centerVal && mapInstance.value?.setCenter(centerVal);
  }
  function setBearing(bearing = 0) {
    props.bearing = bearing;
    mapInstance.value?.setBearing(bearing);
  }
  function setZoom(zoom?: number) {
    zoom = zoom ?? mapInstance.value?.getZoom();
    props.zoom = zoom;
    zoom && mapInstance.value?.setZoom(zoom);
  }
  function setPitch(pitch?: number) {
    pitch = pitch ?? mapInstance.value?.getPitch();
    props.pitch = pitch;
    pitch && mapInstance.value?.setPitch(pitch);
  }
  function setStyle(style?: string | Style) {
    props.style = style;
    style && mapInstance.value?.setStyle(style, {
      diff: true
    });
  }
  function setMaxBounds(bounds?: LngLatBoundsLike) {
    props.maxBounds = bounds;
    mapInstance.value?.setMaxBounds(bounds);
  }
  function setMaxPitch(pitch = 85) {
    props.maxPitch = pitch;
    mapInstance.value?.setMaxPitch(pitch);
  }
  function setMaxZoom(zoom = 24) {
    props.maxZoom = zoom;
    mapInstance.value?.setMaxZoom(zoom);
  }
  function setMinPitch(pitch = 0) {
    props.minPitch = pitch;
    mapInstance.value?.setMinPitch(pitch);
  }
  function setMinZoom(zoom = 0) {
    props.minZoom = zoom;
    mapInstance.value?.setMinZoom(zoom);
  }
  function setProjection(
    projection: Projection = {
      name: "mercator",
    }
  ) {

    props.projection = projection;
    mapInstance.value?.setProjection(projection);
  }
  function setRenderWorldCopies(renderWorldCopies = true) {
    mapInstance.value?.setRenderWorldCopies(renderWorldCopies);
  }

  const methods = {
    setRenderWorldCopies,
    setProjection,
    setMinZoom,
    setMinPitch,
    setMaxZoom,
    setMaxPitch,
    setMaxBounds,
    setStyle,
    setPitch,
    setZoom,
    setBearing,
    setCenter,
  }
  function removeMap() {
    if (mapInstance.value) {
      mapInstance.value.off("load", mapEventLoad);
      mapInstance.value.off("error", mapEventError);
      mapInstance.value.remove();
    }
    mapInstance.value = null
  }
  nextTick(() => {
    initMap()
  })
  onUnmounted(() => {
    removeMap()
  })

  return {
    getMapInstance: computed(() => mapInstance.value),
    getMapStatus: computed(() => mapStatus.value),
    ...methods,
  }
}