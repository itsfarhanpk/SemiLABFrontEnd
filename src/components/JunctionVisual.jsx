import { Pause, Play, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export default function JunctionVisual({ result }) {
  const [playing, setPlaying] = useState(true)
  const [animationKey, setAnimationKey] = useState(0)
  const restart = () => {
    setPlaying(false)
    setAnimationKey(key => key + 1)
    requestAnimationFrame(() => setPlaying(true))
  }
  const unavailable = !result?.valid
  const total = result?.depletion_width_um || 0
  const p = result?.p_side_width_um || 0
  const n = result?.n_side_width_um || 0
  const scale = Math.max(total, 0.2)
  const visualWidth = Math.min(76, Math.max(18, (total / scale) * 52))
  const pWidth = total ? visualWidth * p / total : 0
  const nWidth = total ? visualWidth * n / total : 0
  return <section className="device-card">
    <div className="card-title"><div><div className="eyebrow">DEVICE VIEW</div><h2>Ideal abrupt P–N junction</h2></div><div className="transport-controls"><button onClick={() => setPlaying(value => !value)} aria-label={playing ? 'Pause schematic animation' : 'Play schematic animation'}>{playing ? <Pause size={15} /> : <Play size={15} />}</button><button onClick={restart} aria-label="Restart schematic animation"><RotateCcw size={15} /></button></div></div>
    {unavailable ? <div className="device-unavailable"><span>Junction visualization unavailable</span><small>The depletion model is outside its validity range for this bias.</small></div> : <><div className="junction" key={animationKey}><div className="region p-region"><b>P-TYPE</b><small>neutral bulk</small></div><div className={`depletion p-depletion ${playing ? 'animate' : ''}`} style={{ width: `${pWidth}%` }}><span>− ions</span></div><div className="junction-line" aria-label="Metallurgical junction" /><div className={`depletion n-depletion ${playing ? 'animate' : ''}`} style={{ width: `${nWidth}%` }}><span>+ ions</span></div><div className="region n-region"><b>N-TYPE</b><small>neutral bulk</small></div></div><div className="axis"><span>−{p.toFixed(precision(p))} μm</span><span>metallurgical junction</span><span>+{n.toFixed(precision(n))} μm</span></div><div className="rescale-note">Depletion span is automatically rescaled for visibility · W = {total.toFixed(precision(total))} μm</div><div className="device-legend"><span><i className="dot hole" />mobile holes</span><span><i className="dot electron" />mobile electrons</span><span><i className="dot ion" />fixed ions</span></div></>}
    <div className="animation-note">Animation is schematic: carrier dots are illustrative and not simulated trajectories.</div>
  </section>
}

function precision(value) {
  return value < 0.01 ? 3 : value < 0.1 ? 2 : 2
}
