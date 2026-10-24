import { RotateCcw } from 'lucide-react'

const presets = {
  balanced: { material: 'si', Na: 1e16, Nd: 1e16, appliedVoltage: 0, temperature: 300 },
  pHeavy: { material: 'si', Na: 1e18, Nd: 1e16, appliedVoltage: 0, temperature: 300 },
  nHeavy: { material: 'si', Na: 1e16, Nd: 1e18, appliedVoltage: 0, temperature: 300 },
  reverse: { material: 'si', Na: 1e16, Nd: 1e16, appliedVoltage: -0.8, temperature: 300 },
  forward: { material: 'si', Na: 1e16, Nd: 1e16, appliedVoltage: 0.45, temperature: 300 },
}

const logValue = value => Math.log10(value)

export default function ControlPanel({ parameters, setParameters, reset }) {
  const update = (key, value) => setParameters(prev => ({ ...prev, [key]: value }))
  const slider = (key, min, max, step, value, format) => (
    <label className="control">
      <span>{key === 'Na' ? 'Acceptor concentration' : 'Donor concentration'} <b>{format(value)}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => update(key, key === 'Na' || key === 'Nd' ? 10 ** Number(e.target.value) : Number(e.target.value))} />
      <small>{key === 'Na' ? 'Na' : 'Nd'} · cm⁻³</small>
    </label>
  )
  return <aside className="sidebar">
    <div className="eyebrow">PARAMETERS</div>
    <label className="control"><span>Material</span><select value={parameters.material} onChange={e => update('material', e.target.value)}>
      <option value="si">Silicon · Si</option><option value="ge">Germanium · Ge</option><option value="gaas">Gallium arsenide · GaAs</option>
    </select></label>
    {slider('Na', 14, 18, 0.01, logValue(parameters.Na), value => `10^${Number(value).toFixed(2)}`)}
    {slider('Nd', 14, 18, 0.01, logValue(parameters.Nd), value => `10^${Number(value).toFixed(2)}`)}
    <label className="control"><span>Applied voltage <b>{parameters.appliedVoltage.toFixed(2)} V</b></span><input type="range" min="-1" max=".6" step=".01" value={parameters.appliedVoltage} onChange={e => update('appliedVoltage', Number(e.target.value))} /><small>-1.0 V · +0.6 V</small></label>
    <label className="control"><span>Temperature <b>{parameters.temperature} K</b></span><input type="range" min="250" max="400" step="1" value={parameters.temperature} onChange={e => update('temperature', Number(e.target.value))} /><small>250 K · 400 K</small></label>
    <div className="eyebrow preset-label">PRESETS</div>
    <div className="preset-grid">{Object.entries(presets).map(([key, value]) => <button className="preset" key={key} onClick={() => setParameters(value)}>{({ balanced: 'Balanced junction', pHeavy: 'Heavy p-side', nHeavy: 'Heavy n-side', reverse: 'Reverse bias', forward: 'Forward bias' })[key]}</button>)}</div>
    <button className="reset" onClick={reset}><RotateCcw size={15} /> Reset parameters</button>
  </aside>
}
