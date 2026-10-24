import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const tip = { contentStyle: { background: '#ffffff', border: '1px solid #cbd9e7', borderRadius: 8 }, labelStyle: { color: '#38516e' } }
const number = value => Number(value)
const positionAxis = { type: 'number', domain: ['dataMin', 'dataMax'], tickFormatter: value => number(value).toFixed(2), allowDataOverflow: false }
const points = (result, key) => result?.position_um.map((x, i) => ({ x, y: result[key][i] })) || []
function ChartCard({ title, note, children }) { return <section className="chart-card"><div className="chart-heading"><div><h3>{title}</h3><p>{note}</p></div></div><div className="chart">{children}</div></section> }

export function FieldChart({ result }) {
  return <ChartCard title="Electric field" note="Piecewise depletion approximation · V/m"><ResponsiveContainer><AreaChart data={points(result, 'electric_field_v_per_m')}><CartesianGrid strokeDasharray="3 3" stroke="#dbe5f0" /><XAxis dataKey="x" {...positionAxis} label={{ value: 'Position (μm)', position: 'insideBottom', offset: -5, fill: '#71839c' }} /><YAxis tickFormatter={v => number(v).toExponential(1)} width={72} label={{ value: 'E (V/m)', angle: -90, position: 'insideLeft', fill: '#71839c' }} /><Tooltip {...tip} labelFormatter={v => `x = ${number(v).toFixed(3)} μm`} formatter={v => [`${number(v).toExponential(3)} V/m`, 'Field']} /><Area type="linear" dataKey="y" stroke="#087ea4" fill="#087ea4" fillOpacity=".14" /></AreaChart></ResponsiveContainer></ChartCard>
}

export function ChargeChart({ result }) {
  return <ChartCard title="Charge density" note="Fixed ionized acceptors and donors · C/m³"><ResponsiveContainer><LineChart data={points(result, 'charge_density_c_per_m3')}><CartesianGrid strokeDasharray="3 3" stroke="#dbe5f0" /><XAxis dataKey="x" {...positionAxis} /><YAxis tickFormatter={v => number(v).toExponential(1)} width={72} /><Tooltip {...tip} labelFormatter={v => `x = ${number(v).toFixed(3)} μm`} formatter={v => [`${number(v).toExponential(3)} C/m³`, 'ρ']} /><ReferenceLine y={0} stroke="#71839c" /><Line type="stepAfter" dataKey="y" stroke="#7652bf" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></ChartCard>
}

export function BandChart({ result }) {
  const data = result?.position_um.map((x, i) => ({ x, conduction: result.conduction_band_ev[i], valence: result.valence_band_ev[i] })) || []
  return <ChartCard title="Energy-band diagram" note="Reference: valence edge on neutral p-side · eV"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#dbe5f0" /><XAxis dataKey="x" {...positionAxis} /><YAxis width={52} tickFormatter={v => number(v).toFixed(2)} label={{ value: 'Energy (eV)', angle: -90, position: 'insideLeft', fill: '#71839c' }} /><Tooltip {...tip} labelFormatter={v => `x = ${number(v).toFixed(3)} μm`} formatter={v => [`${number(v).toFixed(4)} eV`]} /><Legend verticalAlign="top" height={25} /><ReferenceLine x={0} stroke="#d88922" strokeDasharray="4 4" label={{ value: 'junction', fill: '#a26a13' }} /><Line dataKey="conduction" stroke="#d88922" dot={false} strokeWidth={2} name="Ec" /><Line dataKey="valence" stroke="#087ea4" dot={false} strokeWidth={2} name="Ev" /></LineChart></ResponsiveContainer></ChartCard>
}

export function DiodeChart({ result }) {
  const data = result?.diode_iv.voltage_v.map((x, i) => ({ x, y: result.diode_iv.normalized_current[i] })) || []
  const selectedVoltage = result?.diode_iv.selected_voltage_v
  return <ChartCard title="Ideal diode I–V" note="Normalized I/I₀ · symlog current axis · ideality n = 1"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#dbe5f0" /><XAxis dataKey="x" type="number" domain={[-1, 0.6]} tickFormatter={v => `${number(v).toFixed(1)} V`} /><YAxis type="number" scale="symlog" domain={[-1.1, 'auto']} ticks={[-1, -0.5, 0, 1, 10, 1e3, 1e6, 1e9]} tickFormatter={v => number(v) === 0 ? '0' : number(v).toExponential(0)} width={62} label={{ value: 'I/I₀', angle: -90, position: 'insideLeft', fill: '#71839c' }} /><Tooltip {...tip} labelFormatter={v => `Va = ${number(v).toFixed(3)} V`} formatter={v => [number(v).toExponential(3), 'I/I₀']} /><ReferenceLine x={selectedVoltage} stroke="#cf4c78" strokeDasharray="4 4" label={{ value: 'selected', fill: '#b43c61' }} /><Line type="linear" dataKey="y" stroke="#cf4c78" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></ChartCard>
}
