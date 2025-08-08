import { useMemo } from 'react'
import dataRaw from '../../AirQualityNYC.json'

export default function useAirQuality() {
  return useMemo(() => {
    const allCols = dataRaw?.meta?.view?.columns || []
    const metaColsCount = allCols.filter((c) => c.id === -1).length
    const cols = allCols.filter((c) => c.id > 0)
    const fieldNames = cols.map((c) => c.fieldName)

    const rows = (dataRaw?.data || []).map((arr) => {
      const obj = {}
      for (let i = 0; i < fieldNames.length; i++) obj[fieldNames[i]] = arr[metaColsCount + i]
      if (obj.data_value != null) obj.data_value = Number(obj.data_value)
      if (obj.start_date) obj.ts = new Date(obj.start_date).getTime()
      if (obj.measure_info) obj.measure_info = String(obj.measure_info).replace('Âµ', 'µ')
      return obj
    })

    const indicators = Array.from(new Set(rows.map((r) => r.name))).sort()
    const geoTypes = Array.from(new Set(rows.map((r) => r.geo_type_name))).sort()
    const placesByKey = new Map()
    for (const r of rows) {
      const key = `${r.geo_type_name}||${r.name}`
      if (!placesByKey.has(key)) placesByKey.set(key, new Set())
      placesByKey.get(key).add(r.geo_place_name)
    }

    const tsAll = rows.map((r) => r.ts).filter(Boolean)
    const minTs = Math.min(...tsAll)
    const maxTs = Math.max(...tsAll)
    const uniquePlaces = new Set(rows.map((r) => r.geo_place_name))

    const stats = {
      totalRows: rows.length,
      indicatorCount: indicators.length,
      placeCount: uniquePlaces.size,
      fromYear: Number.isFinite(minTs) ? new Date(minTs).getFullYear() : '—',
      toYear: Number.isFinite(maxTs) ? new Date(maxTs).getFullYear() : '—',
    }

    return { rows, indicators, geoTypes, placesByKey, stats }
  }, [])
}
