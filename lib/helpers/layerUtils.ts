

export function findLayerDefaultStyleSetVal<T extends Record<string, any> = {}>(obj: T, defaultVal: T) {
  return Object.keys(obj).reduce((style, key) => {
    if (defaultVal[key] !== undefined) {
      style[key] = obj[key]
    }
    return style
  }, {} as Record<string, any>)
}