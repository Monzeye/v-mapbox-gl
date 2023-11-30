import { computed, shallowRef } from 'vue-demi'
import type { FilterOptions, LngLatBoundsLike, LngLatLike, Map,  PaddingOptions,  PointLike, Projection, Style } from 'mapbox-gl';
import type { CreateMapboxActions } from '@/hooks/mapbox/useCreateMapbox';
import type { MaboxMethods, Nullable } from '@/types';

export function useMapbox() {
  const mapInstance = shallowRef<Nullable<Map>>(null);
  let componentMethods: CreateMapboxActions['methods']

  function register(componentAction: CreateMapboxActions) {
    mapInstance.value = componentAction.mapInstance.value
    componentMethods = componentAction.methods
  }
  const methods: MaboxMethods = {
    getContainer: () => {
      return mapInstance.value?.getContainer()
    },
    getCanvasContainer: () => {
      return mapInstance.value?.getCanvasContainer()
    },
    getCanvas: () => {
      return mapInstance.value?.getCanvas()
    },
    getStyle: () => {
      return mapInstance.value?.getStyle()
    },
    getBounds: () => {
      return mapInstance.value?.getBounds()
    },
    getCenter: () => {
      return mapInstance.value?.getCenter()
    },
    getZoom: () => {
      return mapInstance.value?.getZoom()
    },
    getBearing: () => {
      return mapInstance.value?.getBearing()
    },
    getPadding: () => {
      return mapInstance.value?.getPadding()
    },
    getPitch: () => {
      return mapInstance.value?.getPitch()
    },
    getMinZoom: () => {
      return mapInstance.value?.getMinZoom()
    },
    getMaxZoom: () => {
      return mapInstance.value?.getMaxZoom()
    },
    getMinPitch: () => {
      return mapInstance.value?.getMinPitch()
    },
    getMaxPitch: () => {
      return mapInstance.value?.getMaxPitch()
    },
    getFilter: (layerId: string) => {
      return mapInstance.value?.getFilter(layerId)
    },
    getLayer: (layerId: string) => {
      return mapInstance.value?.getLayer(layerId)
    },
    getLayoutProperty: (layerId: string, name: string) => {
      return mapInstance.value?.getLayoutProperty(layerId, name)
    },
    getPaintProperty: (layerId: string, name: string) => {
      return mapInstance.value?.getPaintProperty(layerId, name)
    },
    getSource: (sourceId: string) => {
      return mapInstance.value?.getSource(sourceId)
    },
    project: (lnglat: LngLatLike) => {
      return mapInstance.value?.project(lnglat)
    },
    unproject: (point: PointLike) => {
      return mapInstance.value?.unproject(point)
    },
    queryRenderedFeatures: (point: PointLike | [PointLike, PointLike], options?: ({
      layers?: string[];
      filter?: any[];
    } & FilterOptions)) => {
      return mapInstance.value?.queryRenderedFeatures(point, options)
    },
    querySourceFeatures: (sourceId: string, parameters?: ({
      sourceLayer?: string;
      filter?: any[];
    } & FilterOptions)) => {
      return mapInstance.value?.querySourceFeatures(sourceId, parameters)
    },
    queryTerrainElevation: (lnglat: LngLatLike, options = { exaggerated: true }) => {
      return mapInstance.value?.queryTerrainElevation(lnglat, options)
    },
    isStyleLoaded: () => {
      return mapInstance.value?.isStyleLoaded()
    },
    isMoving: () => {
      return mapInstance.value?.isMoving()
    },
    isZooming: () => {
      return mapInstance.value?.isZooming()
    },
    isRotating: () => {
      return mapInstance.value?.isRotating()
    },
    isEasing: () => {
      return mapInstance.value?.isEasing()
    },
    resize: () => {
      mapInstance.value?.resize()
    },
    remove: () => {
      mapInstance.value?.remove()
    },
    triggerRepaint: () => {
      mapInstance.value?.triggerRepaint()
    },
    setFeatureState: (options: {
      id: number | string;
      source: string;
      sourceLayer?: string;
    }, state: Record<string, any>) => {
      mapInstance.value?.setFeatureState(options, state)
    },
    removeFeatureState: (options: {
      id: number | string;
      source: string;
      sourceLayer?: string;
    }, key: string) => {
      mapInstance.value?.removeFeatureState(options, key)
    },
    getFeatureState: (options: {
      id: number | string;
      source: string;
      sourceLayer?: string;
    }) => {
      return mapInstance.value?.getFeatureState(options)
    },
    setPadding: (padding?: PaddingOptions) => {
      padding && mapInstance.value?.setPadding(padding)
    },
    setRenderWorldCopies: (val: boolean) => {
      componentMethods.setRenderWorldCopies?.(val)
    },
    setProjection: (projection: Projection) => {
      componentMethods.setProjection?.(projection)
    },
    setMinZoom: (zoom: number) => {
      componentMethods.setMaxZoom?.(zoom)
    },
    setMinPitch: (pitch: number) => {
      componentMethods.setMinPitch?.(pitch)
    },
    setMaxZoom: (zoom: number) => {
      componentMethods.setMaxZoom?.(zoom)
    },
    setMaxPitch: (pitch: number) => {
      componentMethods.setMaxPitch?.(pitch)
    },
    setMaxBounds: (bounds?: LngLatBoundsLike) => {
      componentMethods.setMaxBounds?.(bounds)
    },
    setStyle: (style?: string | Style) => {
      componentMethods.setStyle?.(style)
    },
    setPitch: (pitch?: number) => {
      componentMethods.setPitch?.(pitch)
    },
    setZoom: (zoom?: number) => {
      componentMethods.setZoom?.(zoom)
    },
    setBearing: (bearing: number) => {
      componentMethods.setBearing?.(bearing)
    },
    setCenter: (center?: LngLatLike) => {
      componentMethods.setCenter?.(center)
    },

  }

  return {
    register,
    getMapInstance: computed(() => mapInstance.value),
    methods,
  }
}