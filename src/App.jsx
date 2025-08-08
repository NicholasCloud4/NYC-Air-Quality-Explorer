import { useMemo, useState } from 'react'
import './App.css'
import airQualityRaw from '../AirQualityNYC.json'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Legend,
} from 'recharts'

function useAirQuality() {
  // Parse Socrata "tabular" JSON format into array of objects
  return useMemo(() => {
    const allCols = airQualityRaw?.meta?.view?.columns || []
    const metaColsCount = allCols.filter((c) => c.id === -1).length
    const cols = allCols.filter((c) => c.id > 0)
    const fieldNames = cols.map((c) => c.fieldName)

    const rows = (airQualityRaw?.data || []).map((arr) => {
      const obj = {}
      for (let i = 0; i < fieldNames.length; i++) {
        obj[fieldNames[i]] = arr[metaColsCount + i]
      }
      // normalize types
      if (obj.data_value != null) obj.data_value = Number(obj.data_value)
      if (obj.start_date) obj.ts = new Date(obj.start_date).getTime()
      if (obj.measure_info) obj.measure_info = String(obj.measure_info).replace('Âµ', 'µ')
      return obj
    })

    const indicators = Array.from(new Set(rows.map((r) => r.name))).sort()
    const geoTypes = Array.from(new Set(rows.map((r) => r.geo_type_name))).sort()

    // global stats
    const tsAll = rows.map((r) => r.ts).filter(Boolean)
    const minTs = Math.min(...tsAll)
    const maxTs = Math.max(...tsAll)
    const uniquePlaces = new Set(rows.map((r) => r.geo_place_name))

    return {
      rows,
      indicators,
      geoTypes,
      stats: {
        totalRows: rows.length,
        indicatorCount: indicators.length,
        placeCount: uniquePlaces.size,
        fromYear: new Date(minTs).getFullYear(),
        toYear: new Date(maxTs).getFullYear(),
      },
    }
  }, [])
}

function formatTick(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  // Highlight January and June ticks for readability
  if (m === 1) return `${y}`
  if (m === 6) return `${y}-06`
  return ''
}

function humanize(val) {
  if (val == null || Number.isNaN(val)) return '—'
  if (Math.abs(val) >= 1000) return val.toLocaleString()
  if (Math.abs(val) >= 100) return val.toFixed(1)
  if (Math.abs(val) >= 10) return val.toFixed(2)
  return Number(val).toPrecision(3)
}

function App() {
  const { rows, indicators, geoTypes, stats } = useAirQuality()

  // Defaults
  const defaultIndicator = indicators[0]
  const defaultGeoType = geoTypes.includes('Citywide') ? 'Citywide' : geoTypes[0]

  const [indicator, setIndicator] = useState(defaultIndicator)
  const [geoType, setGeoType] = useState(defaultGeoType)

  const places = useMemo(() => {
    const set = new Set(
      rows.filter((r) => r.geo_type_name === geoType && r.name === indicator).map((r) => r.geo_place_name)
    )
    return Array.from(set).sort()
  }, [rows, geoType, indicator])

  const [place, setPlace] = useState('')

  // Ensure place always valid for current filters
  const safePlace = useMemo(() => {
    if (place && places.includes(place)) return place
    return places[0] || ''
  }, [place, places])

  const filtered = useMemo(() => {
    return rows
      .filter((r) => r.name === indicator && r.geo_type_name === geoType && r.geo_place_name === safePlace)
      .sort((a, b) => a.ts - b.ts)
  }, [rows, indicator, geoType, safePlace])

  // Measure/unit for tooltips/labels
  const measure = filtered[0]?.measure
  const unit = filtered[0]?.measure_info

  // Last 25 rows for the table
  const tableData = useMemo(() => filtered.slice(-25).reverse(), [filtered])

  // Color palette per indicator
  const color = useMemo(() => {
    const palette = {
      'Nitrogen dioxide (NO2)': '#7c3aed',
      'Fine particles (PM 2.5)': '#0ea5e9',
      'Ozone (O3)': '#22c55e',
      'Asthma emergency department visits due to PM2.5': '#ef4444',
      'Asthma emergency departments visits due to Ozone': '#10b981',
      'Asthma hospitalizations due to Ozone': '#f59e0b',
      'Cardiovascular hospitalizations due to PM2.5 (age 40+)': '#8b5cf6',
      'Respiratory hospitalizations due to PM2.5 (age 20+)': '#14b8a6',
      'Deaths due to PM2.5': '#e11d48',
      'Cardiac and respiratory deaths due to Ozone': '#6366f1',
    }
    return palette[indicator] || '#06b6d4'
  }, [indicator])

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <h1>NYC Air Quality Explorer</h1>
          <p>
            Interactive overview of New York City air quality indicators across neighborhoods and time.
            Explore by indicator, geography, and place to understand trends.
          </p>
          <div className="kpis">
            <div className="kpi">
              <div className="kpi__label">Rows</div>
              <div className="kpi__value">{stats.totalRows.toLocaleString()}</div>
            </div>
            <div className="kpi">
              <div className="kpi__label">Indicators</div>
              <div className="kpi__value">{stats.indicatorCount}</div>
            </div>
            <div className="kpi">
              <div className="kpi__label">Places</div>
              <div className="kpi__value">{stats.placeCount.toLocaleString()}</div>
            </div>
            <div className="kpi">
              <div className="kpi__label">Timespan</div>
              <div className="kpi__value">{stats.fromYear} – {stats.toYear}</div>
            </div>
          </div>
        </div>
      </header>

      <section className="controls container">
        <div className="control">
          <label htmlFor="indicator">Indicator</label>
          <select id="indicator" value={indicator} onChange={(e) => setIndicator(e.target.value)}>
            {indicators.map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="control">
          <label htmlFor="geotype">Geo Type</label>
          <select id="geotype" value={geoType} onChange={(e) => setGeoType(e.target.value)}>
            {geoTypes.map((g) => (
              <option value={g} key={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="control">
          <label htmlFor="place">Place</label>
          <select id="place" value={safePlace} onChange={(e) => setPlace(e.target.value)}>
            {places.map((p) => (
              <option value={p} key={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        {measure && unit && (
          <div className="control control--readonly">
            <label>Measure</label>
            <div className="pill">{measure} ({unit})</div>
          </div>
        )}
      </section>

      <section className="container card">
        <h2>Trend over time</h2>
        <p className="subtle">
          {indicator} in {safePlace} ({geoType})
        </p>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={filtered} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="4 4" opacity={0.4} />
              <XAxis
                dataKey="ts"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatTick}
                tick={{ fill: 'var(--muted-2)' }}
              />
              <YAxis tick={{ fill: 'var(--muted-2)' }} tickFormatter={humanize}>
                {/* axis label could be added here */}
              </YAxis>
              <Tooltip
                contentStyle={{ background: 'var(--elev-2)', border: '1px solid var(--border)', borderRadius: 12 }}
                labelFormatter={(ts) => new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                formatter={(v, _name, ctx) => [humanize(v) + (unit ? ` ${unit}` : ''), ctx?.payload?.time_period]}
              />
              <Legend />
              <Line type="monotone" dataKey="data_value" name={`${indicator}`} stroke={color} strokeWidth={3} dot={false} />
              <Brush height={24} stroke={color} travellerWidth={10} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="container grid">
        <div className="card">
          <h3>Latest values</h3>
          <p className="subtle">Most recent 25 observations for this selection</p>
          <div className="table">
            <div className="thead">
              <div>Time period</div>
              <div>Start date</div>
              <div>Value</div>
            </div>
            <div className="tbody">
              {tableData.map((r, i) => (
                <div className="tr" key={i}>
                  <div>{r.time_period}</div>
                  <div>{new Date(r.start_date).toLocaleDateString()}</div>
                  <div>
                    <span className="badge" style={{ background: color }}>{humanize(r.data_value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <h3>About this dataset</h3>
          <ul className="bullets">
            <li>Source: NYC DOHMH (NYC OpenData)</li>
            <li>Rows: {stats.totalRows.toLocaleString()}</li>
            <li>Indicators: {stats.indicatorCount}</li>
            <li>Geography types: {geoTypes.join(', ')}</li>
            <li>Time span: {stats.fromYear} – {stats.toYear}</li>
          </ul>
          <p className="note">
            Values represent the selected indicator, measured as <b>{measure || '—'}</b> in <b>{unit || '—'}</b> across
            NYC geographies and time periods.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <span>Built with React + Vite</span>
          <span>Data © NYC OpenData</span>
        </div>
      </footer>
    </div>
  )
}

export default App
