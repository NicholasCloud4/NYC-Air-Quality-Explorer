export default function AboutCard({ stats, geoTypes, measure, unit }) {
  return (
    <div className="card">
      <h3>About this dataset</h3>
      <ul className="bullets">
        <li>Source: NYC DOHMH <a style={{ textDecoration: 'none', color: '#06b6d4' }} href="https://data.cityofnewyork.us/Environment/Air-Quality/c3uy-2p5r/about_data">(NYC OpenData)</a></li>
        <li>Rows: {stats.totalRows.toLocaleString()}</li>
        <li>Indicators: {stats.indicatorCount}</li>
        <li>Geography types: {geoTypes.join(', ')}</li>
        <li>Time span: {stats.fromYear} – {stats.toYear}</li>
      </ul>
      <p className="note">
        Values represent the selected indicator, measured as <b>{measure || '—'}</b> in <b>{unit || '—'}</b> across NYC
        geographies and time periods.
      </p>
    </div>
  )
}
