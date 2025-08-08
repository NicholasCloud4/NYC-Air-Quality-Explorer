import { humanize } from '../utils/formatters'

export default function LatestTable({ rows, color }) {
  return (
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
          {rows.map((r, i) => (
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
  )
}
