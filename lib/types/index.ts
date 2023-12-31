
import type {
  BackgroundLayer,
  Expression,
  CircleLayer,
  FillExtrusionLayer,
  FillLayer,
  HeatmapLayer,
  HillshadeLayer,
  LineLayer,
  RasterLayer,
  SymbolLayer,
  SkyLayer,
  LngLatLike,
  Style,
  LngLatBoundsLike,
  PaddingOptions,
  Point,
  LngLat,
  PointLike,
  FilterOptions,
  MapboxGeoJSONFeature,
} from 'mapbox-gl';
import type { ShallowRef, Ref, ComputedRef } from 'vue-demi';
import type { CreateMapboxActions } from '@/hooks/mapbox/useCreateMapbox';


export type Nullable<T> = T | null;

export type Undefinedable<T> = T | undefined

export type RefOrNo<T> = Ref<T> | T;

export type ShallowRefOrNo<T> = ShallowRef<T> | T;

export type ILayer =
  | BackgroundLayer
  | CircleLayer
  | FillExtrusionLayer
  | FillLayer
  | HeatmapLayer
  | HillshadeLayer
  | LineLayer
  | RasterLayer
  | SymbolLayer
  | SkyLayer;

export interface CreateBaseLayerActions<Layer extends ILayer> {
  layerId: string;
  getLayer: ComputedRef<Nullable<Layer>>;
  setBeforeId: (beforeId?: string) => void;
  setFilter: (filter?: Expression) => void;
  setPaintProperty: (name: string, value: any, options?: { validate: boolean }) => void;
  setLayoutProperty: (name: string, value: any, options?: { validate: boolean }) => void;
  setZoomRange: (minzoom?: number, maxzoom?: number) => void;
  removeLayer: () => void;
  // createLayer: () => void;
}

export interface CreateLayerActions<Layer extends ILayer> extends CreateBaseLayerActions<Layer> {
  setStyle: (styleVal: Layer['layout'] & Layer['paint']) => void;
}

export interface ChainCameraItem {
  lngLat: LngLatLike;
  lookAtLngLat: LngLatLike;
  duration: number;
  altitude: number;
}
type CreateMapboxActionsMethods = CreateMapboxActions['methods']
export interface MaboxMethods extends CreateMapboxActionsMethods {
  getContainer: () => HTMLElement | undefined;
  getCanvasContainer: () => HTMLElement | undefined;
  getCanvas: () => HTMLCanvasElement | undefined;
  getStyle: () => Style | undefined;
  getBounds: () => LngLatBoundsLike | undefined;
  getCenter: () => LngLatLike | undefined;
  getZoom: () => number | undefined;
  getBearing: () => number | undefined;
  getPadding: () => PaddingOptions | undefined;
  getPitch: () => number | undefined;
  getMinZoom: () => number | undefined;
  getMaxZoom: () => number | undefined;
  getMinPitch: () => number | undefined;
  getMaxPitch: () => number | undefined;
  getFilter: (layerId: string) => any[] | undefined;
  getLayer: (layerId: string) => any | undefined;
  getPaintProperty: (layerId: string, name: string) => any | undefined;
  getLayoutProperty: (layerId: string, name: string) => any | undefined;
  getSource: (sourceId: string) => any | undefined;
  triggerRepaint: () => void;
  project: (lnglat: LngLatLike) => Point | undefined;
  unproject: (point: Point) => LngLat | undefined;
  queryRenderedFeatures: (point: PointLike | [PointLike, PointLike], options?: ({
    layers?: string[];
    filter?: any[];
  } & FilterOptions)) => MapboxGeoJSONFeature[] | undefined;
  querySourceFeatures: (sourceID: string, options?: ({
    sourceLayer?: string;
    filter?: any[];
  } & FilterOptions)) => MapboxGeoJSONFeature[] | undefined;
  queryTerrainElevation: (lnglat: LngLatLike, options: { exaggerated: boolean }) => number | null | undefined;
  isStyleLoaded: () => boolean | undefined;
  isMoving: () => boolean | undefined;
  isZooming: () => boolean | undefined;
  isRotating: () => boolean | undefined;
  isEasing: () => boolean | undefined;
  resize: () => void;
  remove: () => void;
  setFeatureState: (options: {
    id: number | string;
    source: string;
    sourceLayer?: string;
  }, state: Record<string, any>) => void;
  removeFeatureState: (options: {
    id: number | string;
    source: string;
    sourceLayer?: string;
  }, key: string) => void;
  getFeatureState: (options: {
    id: number | string;
    source: string;
    sourceLayer?: string;
  }) => Record<string, any> | undefined;
  setPadding: (padding: PaddingOptions) => void;
}
