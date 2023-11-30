import { hasLayer } from "@/helpers/mapUtils"
import type { CreateLayerActions, ILayer, Nullable } from "@/types"
import type { AnyLayer, Expression, Map } from "mapbox-gl"
import { computed } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'

export function useLayer<T extends ILayer>() {
  const layer = shallowRef<Nullable<AnyLayer>>(null)
  const layerId = ref<string>()
  const mapInstance = ref<Nullable<Map>>()
  let componentMethods: CreateLayerActions<T> | null = null

  function register(componentAction: CreateLayerActions<T>, map: Map) {
    layer.value = componentAction.getLayer.value
    layerId.value = componentAction.layerId
    componentMethods = componentAction
    mapInstance.value = map
  }

  const methods = {
    layerId,
    getLayer: computed(() => layer.value),
    getFilter: () => {
      if (mapInstance.value && layerId.value && hasLayer(mapInstance.value, layerId.value)) {
        return mapInstance.value.getFilter(layerId.value)
      }
    },
    getLayoutProperty: (name: keyof T['layout']) => {
      if (mapInstance.value && layerId.value && hasLayer(mapInstance.value, layerId.value)) {
        return mapInstance.value.getLayoutProperty(layerId.value, name as string)
      }
    },
    getPaintProperty: (name: keyof T['paint']) => {
      if (mapInstance.value && layerId.value && hasLayer(mapInstance.value, layerId.value)) {
        return mapInstance.value.getPaintProperty(layerId.value, name as string)
      }
    },
    setBeforeId: (beforeId?: string) => {
      componentMethods?.setBeforeId(beforeId)
    },
    setFilter: (filter?: Expression) => {
      componentMethods?.setFilter(filter)
    },
    setPaintProperty: (name: string, value: any, options?: { validate: boolean }) => {
      componentMethods?.setPaintProperty(name, value, options)
    },
    setLayoutProperty: (name: string, value: any, options?: { validate: boolean }) => {
      componentMethods?.setLayoutProperty(name, value, options)
    },
    setZoomRange: (minzoom?: number, maxzoom?: number) => {
      componentMethods?.setZoomRange(minzoom, maxzoom)
    },
    removeLayer: () => {
      componentMethods?.removeLayer()
    },
    setStyle: (styleVal: T['layout'] & T['paint']) => {
      componentMethods?.setStyle(styleVal)
    },
  }

  return {
    register,
    methods
  }
}