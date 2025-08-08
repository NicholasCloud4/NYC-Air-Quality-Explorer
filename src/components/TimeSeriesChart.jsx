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
import { formatTick, humanize } from '../utils/formatters'

export default function TimeSeriesChart({ data, indicator, place, geoType, unit, color }) {
  return (
    <section className="container card">
      <h2>Trend over time</h2>
      <p className="subtle">
        {indicator} in {place} ({geoType})
      </p>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" opacity={0.4} />
            <XAxis
              dataKey="ts"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatTick}
              tick={{ fill: 'var(--muted-2)' }}
            />
            <YAxis tick={{ fill: 'var(--muted-2)' }} tickFormatter={humanize} />
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
  )
}
