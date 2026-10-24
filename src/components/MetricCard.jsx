export default function MetricCard({ label, value, unit, accent }) {
  return <div className={`metric ${accent || ''}`}><span>{label}</span><strong>{value ?? '—'}</strong><small>{unit}</small></div>
}
