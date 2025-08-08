export default function Hero({ stats }) {
  return (
    <header className="hero">
      <div className="hero__bg" />
      <div className="hero__content">
        <h1>NYC Air Quality Explorer</h1>
        <p>
          Interactive overview of New York City air quality indicators across neighborhoods and time. Explore by
          indicator, geography, and place to understand trends.
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
  )
}
