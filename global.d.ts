
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Mapbox: typeof import('v-mapbox-gl')['Mapbox']
    CanvasSource: typeof import('v-mapbox-gl')['CanvasSource']
    GeoJsonSource: typeof import('v-mapbox-gl')['GeoJsonSource']
    ImageSource: typeof import('v-mapbox-gl')['ImageSource']
    RasterDemSource: typeof import('v-mapbox-gl')['RasterDemSource']
    RasterSource: typeof import('v-mapbox-gl')['RasterSource']
    VectorTileSource: typeof import('v-mapbox-gl')['VectorTileSource']
    VideoSource: typeof import('v-mapbox-gl')['VideoSource']

    BackgroundLayer: typeof import('v-mapbox-gl')['BackgroundLayer']
    CircleLayer: typeof import('v-mapbox-gl')['CircleLayer']
    CustomLayer: typeof import('v-mapbox-gl')['CustomLayer']
    FillExtrusionLayer: typeof import('v-mapbox-gl')['FillExtrusionLayer']
    FillLayer: typeof import('v-mapbox-gl')['FillLayer']
    HeatmapLayer: typeof import('v-mapbox-gl')['HeatmapLayer']
    HillshadeLayer: typeof import('v-mapbox-gl')['HillshadeLayer']
    LineLayer: typeof import('v-mapbox-gl')['LineLayer']
    RasterLayer: typeof import('v-mapbox-gl')['RasterLayer']
    SkyLayer: typeof import('v-mapbox-gl')['SkyLayer']
    SymbolLayer: typeof import('v-mapbox-gl')['SymbolLayer']

    AttributionControl: typeof import('v-mapbox-gl')['AttributionControl']
    CustomControl: typeof import('v-mapbox-gl')['CustomControl']
    FullscreenControl: typeof import('v-mapbox-gl')['FullscreenControl']
    GeolocateControl: typeof import('v-mapbox-gl')['GeolocateControl']
    NavigationControl: typeof import('v-mapbox-gl')['NavigationControl']
    ScaleControl: typeof import('v-mapbox-gl')['ScaleControl']

    Marker: typeof import('v-mapbox-gl')['Marker']
    Popup: typeof import('v-mapbox-gl')['Popup']

    Image: typeof import('v-mapbox-gl')['Image']
    Fog: typeof import('v-mapbox-gl')['Fog']
    Light: typeof import('v-mapbox-gl')['Light']
    Terrain: typeof import('v-mapbox-gl')['Terrain']
  }
}
export {}
