export default function Controls({
  indicators,
  geoTypes,
  places,
  indicator,
  geoType,
  place,
  setIndicator,
  setGeoType,
  setPlace,
  measure,
  unit,
}) {
  return (
    <section className="controls container">
      <div className="control">
        <label htmlFor="indicator">
          <span className="label-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          Indicator
        </label>
        <select id="indicator" value={indicator} onChange={(e) => setIndicator(e.target.value)}>
          {indicators.map((n) => (
            <option value={n} key={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div className="control">
        <label htmlFor="geotype">
          <span className="label-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l7 7-7 7-7-7 7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Geo Type
        </label>
        <select id="geotype" value={geoType} onChange={(e) => setGeoType(e.target.value)}>
          {geoTypes.map((g) => (
            <option value={g} key={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="control">
        <label htmlFor="place">
          <span className="label-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21s7-5.3 7-11a7 7 0 10-14 0c0 5.7 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2" fill="currentColor" />
            </svg>
          </span>
          Place
        </label>
        <select id="place" value={place} onChange={(e) => setPlace(e.target.value)}>
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
  )
}
