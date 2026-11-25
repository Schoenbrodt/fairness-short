import Papa from 'papaparse'

const dataCache = {}

export async function loadCsv(path) {
  if (dataCache[path]) {
    return dataCache[path]
  }

  const response = await fetch(path)
  const text = await response.text()
  const result = Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })

  dataCache[path] = result.data
  return result.data
}
