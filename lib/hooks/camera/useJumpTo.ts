import { watchEffect, ref } from 'vue-demi'
import type { ShallowRef } from 'vue-demi'
import type { Map, CameraOptions } from 'mapbox-gl'
import type { Nullable, Undefinedable } from '@/types'

export function useJumpTo(map: ShallowRef<Nullable<Map>>, options?: CameraOptions) {
  const jumpOptions = ref<Undefinedable<CameraOptions>>(options)
  watchEffect(() => {
    if (map.value && jumpOptions.value) {
      map.value.flyTo(jumpOptions.value);
    }
  })
  function jumpTo(options?: CameraOptions) {
    if (options) jumpOptions.value = options;
  }
  return {
    jumpTo,
  }
}