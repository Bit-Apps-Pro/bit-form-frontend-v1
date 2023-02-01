/* eslint-disable no-undef */

export default async function bitsFetchFront(data, action, contentType = null, queryParam = null) {
  if (!bitFormsFront) return false
  const uri = new URL(bitFormsFront?.ajaxURL)
  uri.searchParams.append('action', action)
  uri.searchParams.append('_ajax_nonce', bitFormsFront?.nonce)

  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  const response = await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': contentType === null ? 'application/x-www-form-urlencoded' : contentType },
    body: data instanceof FormData ? data : JSON.stringify(data),
  })
    .then(res => res.json())

  return response
}
