import { computed, ref, shallowRef } from 'vue-demi';
import type { ComputedRef } from 'vue-demi';
import type { CreateGeoJsonSourceActions } from "@/hooks/sources/useCreateGeoJsonSource";
import type { GeoJSONSource, GeoJSONSourceOptions } from "mapbox-gl";
import type { Point, Feature, GeoJsonProperties } from "geojson";
import type { Nullable } from "@/types";

interface Methods {
  getSource: ComputedRef<Nullable<GeoJSONSource>>;
  setData: (dataVal: GeoJSONSourceOptions['data']) => void;
  getClusterExpansionZoom: (clusterId: number) => Promise<number>;
  getClusterChildren: <T extends GeoJsonProperties = {}>(clusterId: number) => Promise<Feature<Point, T>[]>;
  getClusterLeaves: <T extends GeoJsonProperties = {}>(clusterId: number, limit?: number, offset?: number) => Promise<Feature<Point, T>[]>;
}

export function useGeoJsonSource() {
  const source = shallowRef<Nullable<GeoJSONSource>>(null)
  const sourceId = ref<string>()
  let componentMethods: CreateGeoJsonSourceActions

  function register(componentAction: CreateGeoJsonSourceActions) {
    source.value = componentAction.getSource.value
    sourceId.value = componentAction.sourceId
    componentMethods = componentAction
  }

  const methods: Methods = {
    getSource: computed(() => source.value),
    setData: (dataVal: GeoJSONSourceOptions['data']) => {
      componentMethods.setData?.(dataVal)
    },
    getClusterExpansionZoom: (clusterId: number) => {
      return new Promise((resolve, reject) => {
        source.value?.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return reject(err)
          resolve(zoom)
        })
      })
    },
    getClusterChildren: <T extends GeoJsonProperties = {}>(clusterId: number) => {
      return new Promise<Feature<Point, T>[]>((resolve, reject) => {
        source.value?.getClusterChildren(clusterId, (err, features) => {
          if (err) return reject(err)
          resolve(features as Feature<Point, T>[])
        })
      })
    },
    getClusterLeaves: <T extends GeoJsonProperties = {}>(clusterId: number, limit = 10, offset = 0) => {
      return new Promise<Feature<Point, T>[]>((resolve, reject) => {
        source.value?.getClusterLeaves(clusterId, limit, offset, (err, features) => {
          if (err) return reject(err)
          resolve(features as Feature<Point, T>[])
        })
      })
    }
  }

  return {
    sourceId: computed(() => sourceId.value),
    getSource: computed(() => source.value),
    register,
    methods
  }
}