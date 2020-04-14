export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const isArrContain = function(target, source) {
  return source.every(r => target.indexOf(r) !== -1)
}

export function exportFile(url, param) {
  if (!param) return
  const assign = Object.assign({}, param)
  const paramStr = Object.keys(assign).reduce((arr, k) => {
    if (param[k]) {
      arr.push(k + '=' + param[k])
    }

    return arr
  }, []).join('&')

  const baseApi = process.env.BASE_API
  const origin = window.location.origin
  window.location.href = origin + baseApi + url + '?' + paramStr
}
