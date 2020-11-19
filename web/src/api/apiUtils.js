export async function handleResp(resp) {
  if (resp.status === 200) {
    return resp.json()
  }
  if (resp.status === 400) {
    let error = await resp.text()
    throw Error(error)
  }
}

export function handleError(error) {
  console.log('API call error: ' + error)
  throw error
}

export function encodeFormBody(items) {
  let output = String()
  for (let item in items) {
    if (items[item] === null) { continue }
    output += "&" + item + "=" + encodeURIComponent(items[item])
  }
  return output
}

