import type { Map, Expression, FillExtrusionLayer, FillExtrusionLayout, FillExtrusionPaint, AnySourceData, FillExtrusionLayerStyle } from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer';
import { findLayerDefaultStyleSetVal } from '@/helpers/layerUtils';
import { MapboxLayerType } from '@/enums/MapboxLayerEnum';

type Layer = FillExtrusionLayer
type Layout = FillExtrusionLayout
type Paint = FillExtrusionPaint

const paintDefault: Paint = {
  'fill-extrusion-base': 0,
  'fill-extrusion-color': "#000000",
  'fill-extrusion-height': 0,
  'fill-extrusion-opacity': 1,
  'fill-extrusion-pattern': '',
  'fill-extrusion-translate': [0, 0],
  'fill-extrusion-translate-anchor': "map",
  'fill-extrusion-vertical-gradient': true,
}

const layoutDefault: Layout = {
  'visibility': 'visible'
}

interface CreateFillExtrusionLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>,
  source: ShallowRefOrNo<string | AnySourceData | object | null>,
  id?: string;
  beforeId?: string;
  filter?: Expression;
  style?: FillExtrusionLayerStyle;
  maxzoom?: number;
  minzoom?: number;
  metadata?: object;
  sourceLayer?: string; // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void;
}


export function useCreateFillExtrusionLayer(props: CreateFillExtrusionLayerProps) {
  const layerType = MapboxLayerType.FillExtrusion
  props.style = props.style || {}
  const paint: Paint = findLayerDefaultStyleSetVal(props.style, paintDefault)
  const layout: Layout = findLayerDefaultStyleSetVal(props.style, layoutDefault)
  const { setLayoutProperty, setPaintProperty, ...actions } = useCreateLayer<Layer>({
    map: props.map,
    source: props.source,
    type: layerType,
    id: props.id,
    beforeId: props.beforeId,
    filter: props.filter,
    layout: layout,
    paint: paint,
    maxzoom: props.maxzoom,
    minzoom: props.minzoom,
    metadata: props.metadata,
    sourceLayer: props.sourceLayer,
    register: (actions, map) => {
      props.register && props.register({
        ...actions,
        setStyle,
      }, map)
    },
  });

  function setStyle(styleVal: FillExtrusionLayerStyle = {}) {
    Object.keys(styleVal).forEach((key) => {
      if (paintDefault[key as keyof Paint]) {
        setPaintProperty(key, styleVal[key as keyof Paint], { validate: false })
      }
      if (layoutDefault[key as keyof Layout]) {
        setLayoutProperty(key, styleVal[key as keyof Layout], { validate: false })
      }
    })
  }

  return {
    ...actions,
    setStyle,
    setLayoutProperty,
    setPaintProperty
  }
}