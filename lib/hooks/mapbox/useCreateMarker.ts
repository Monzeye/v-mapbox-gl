import { onUnmounted, watchEffect, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
import type { EventedListener, LngLatLike, Map, MarkerOptions, Popup } from 'mapbox-gl'
import { Marker } from 'mapbox-gl'
import { getShallowRef } from '@/helpers/getRef';
import type { Nullable, ShallowRefOrNo } from '@/types';
import { lngLatLikeHasValue } from '@/helpers/mapUtils';


interface CreateMarkerProps {
  map: ShallowRefOrNo<Nullable<Map>>;
  lnglat?: LngLatLike;
  popup?: ShallowRefOrNo<Nullable<Popup>>;
  el?: Ref<HTMLElement | undefined>
  options?: MarkerOptions;
  on?: {
    dragstart?: (e: Event) => void;
    drag?: (e: Event) => void;
    dragend?: (e: Event) => void;
  }
}

export function useCreateMarker({
  map,
  lnglat: lnglatVal,
  popup: popupVal,
  el,
  options = {},
  on = {},
}: CreateMarkerProps) {
  const mapInstance = getShallowRef(map)
  const popup = getShallowRef(popupVal)
  const marker = getShallowRef<Nullable<Marker>>(null)

  function dragstartEventFn(ev: Event) {
    on.dragstart?.(ev)
  }
  function dragEventFn(ev: Event) {
    on.drag?.(ev)
  }
  function dragendEventFn(ev: Event) {
    on.dragend?.(ev)
  }
  let oPopup = popup.value
  const stopEffect = watchEffect((onCleanUp) => {
    if (mapInstance.value && el?.value && !marker.value) {
      marker.value = new Marker({
        ...options,
        element: el?.value,
      })
      lngLatLikeHasValue(lnglatVal) && setLngLat(lnglatVal)

      oPopup && setPopup(oPopup)
      marker.value.addTo(mapInstance.value)
      marker.value.on('dragstart', dragstartEventFn as unknown as EventedListener)
      marker.value.on('drag', dragEventFn as unknown as EventedListener)
      marker.value.on('dragend', dragendEventFn as unknown as EventedListener)
    }
    onCleanUp(remove)
  })
  watch(popup, setPopup)

  function setLngLat(lnglat: LngLatLike) {
    if (marker.value) {
      marker.value.setLngLat(lnglat)
    }
  }
  function setPopup(popup?: Popup | null) {
    oPopup = popup
    if (marker.value) {
      marker.value.setPopup(popup!)
    }
  }
  function setOffset(offset: [number, number]) {
    if (marker.value) {
      marker.value.setOffset(offset)
    }
  }
  function setDraggable(draggable: boolean) {
    if (marker.value) {
      marker.value.setDraggable(draggable)
    }
  }
  function togglePopup() {
    if (marker.value) {
      marker.value.togglePopup()
    }
  }
  function getElement() {
    if (marker.value) {
      return marker.value.getElement()
    }
    return null
  }
  function setRotation(rotation: number) {
    if (marker.value) {
      marker.value.setRotation(rotation)
    }
  }
  function setRotationAlignment(alignment: 'map' | 'viewport') {
    if (marker.value) {
      marker.value.setRotationAlignment(alignment)
    }
  }
  function setPitchAlignment(alignment: 'map' | 'viewport') {
    if (marker.value) {
      marker.value.setPitchAlignment(alignment)
    }
  }
  function setOccludedOpacity(opacity: number) {
    if (marker.value) {
      marker.value.setOccludedOpacity(opacity)
    }
  }

  function remove() {
    if (marker.value) {
      marker.value.off('dragstart', dragstartEventFn as unknown as EventedListener)
      marker.value.off('drag', dragEventFn as unknown as EventedListener)
      marker.value.off('dragend', dragendEventFn as unknown as EventedListener)
      marker.value.remove()
    }
    marker.value = null
  }
  onUnmounted(() => {
    stopEffect()
    oPopup = null
  })
  return {
    setLngLat,
    setPopup,
    setOffset,
    setDraggable,
    togglePopup,
    getElement,
    setRotation,
    setRotationAlignment,
    setPitchAlignment,
    setOccludedOpacity
  }
}
