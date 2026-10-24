import { Pause, Play, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export default function JunctionVisual({ result }) {
  const [playing, setPlaying] = useState(true)
  const p = result?.p_side_width_um || 0
  const n = result?.n_side_width_um || 0
  const total = Math.max(result?.depletion_width_um || 1, 0.001)
  const pPercent = Math.min(42, 12 + p / total * 30)
  const nPercent = Math.min(42, 12 + n / total * 30)
  return <section className="device-card"><div className="card-title"><div><div className="eyebrow">DEVICE VIEW</div><h2>Ideal abrupt P–N junction</h2></div><div className="transport-controls"><button onClick={() => setPlaying(!playing)} aria-label="toggle animation">{playing ? <Pause size={15} /> : <Play size={15} />}</button><button onClick={() => setPlaying(true)} aria-label="reset animation"><RotateCcw size={15} /></button></div></div><div className="junction"><div className="region p-region"><b>P-TYPE</b><small>acceptors · holes</small></div><div className={`depletion ${playing ? 'animate' : ''}`} style={{ width: `${pPercent + nPercent}%` }}><span>DEPLETION</span><small>{result?.depletion_width_um?.toFixed(2) || '—'} μm</small></div><div className="region n-region"><b>N-TYPE</b><small>donors · electrons</small></div></div><div className="axis"><span>−{p.toFixed(2)} μm</span><span>junction</span><span>+{n.toFixed(2)} μm</span></div><div className="device-legend"><span><i className="dot hole" />mobile holes</span><span><i className="dot electron" />mobile electrons</span><span><i className="dot ion" />fixed ions</span></div></section>
}
