import { useMemo, useState } from 'react'
import './App.css'
import useAirQuality from './hooks/useAirQuality'
import Hero from './components/Hero'
import Controls from './components/Controls'
import TimeSeriesChart from './components/TimeSeriesChart'
import LatestTable from './components/LatestTable'
import AboutCard from './components/AboutCard'

function App() {
  const { rows, indicators, geoTypes, placesByKey, stats } = useAirQuality()

  const defaultIndicator = indicators[0]
  const defaultGeoType = geoTypes.includes('Citywide') ? 'Citywide' : geoTypes[0]

  const [indicator, setIndicator] = useState(defaultIndicator)
  const [geoType, setGeoType] = useState(defaultGeoType)
  const [place, setPlace] = useState('')

  const places = useMemo(() => {
    const key = `${geoType}||${indicator}`
    const set = placesByKey.get(key) || new Set()
    return Array.from(set).sort()
  }, [placesByKey, geoType, indicator])

  const safePlace = useMemo(() => (place && places.includes(place) ? place : places[0] || ''), [place, places])

  const filtered = useMemo(() => {
    return rows
      .filter((r) => r.name === indicator && r.geo_type_name === geoType && r.geo_place_name === safePlace)
      .sort((a, b) => a.ts - b.ts)
  }, [rows, indicator, geoType, safePlace])

  const measure = filtered[0]?.measure
  const unit = filtered[0]?.measure_info

  const tableData = useMemo(() => filtered.slice(-25).reverse(), [filtered])

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
      <Hero stats={stats} />

      <Controls
        indicators={indicators}
        geoTypes={geoTypes}
        places={places}
        indicator={indicator}
        geoType={geoType}
        place={safePlace}
        setIndicator={setIndicator}
        setGeoType={setGeoType}
        setPlace={setPlace}
        measure={measure}
        unit={unit}
      />

      <TimeSeriesChart data={filtered} indicator={indicator} place={safePlace} geoType={geoType} unit={unit} color={color} />

      <section className="container grid">
        <LatestTable rows={tableData} color={color} />
        <AboutCard stats={stats} geoTypes={geoTypes} measure={measure} unit={unit} />
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
