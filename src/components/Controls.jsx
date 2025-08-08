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
