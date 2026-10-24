import { Pause, Play, RotateCcw } from 'lucide-react'
import { useState } from 'react'

const neutralParticles = Array.from({ length: 12 }, (_, index) => index)
const depletionIons = Array.from({ length: 8 }, (_, index) => index)

function Particle({ type, sign, index }) {
  return <span className={`particle ${type}`} aria-label={`${type} ${sign}`} style={{ '--particle-index': index }}>
    {sign}
  </span>
}

function ParticleField({ type, sign, particles }) {
  return <div className="particle-field" aria-hidden="true">
    {particles.map(index => <Particle key={index} type={type} sign={sign} index={index} />)}
  </div>
}

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
  const pLabel = pWidth >= 8
  const nLabel = nWidth >= 8

  return <section className="device-card">
    <div className="card-title">
      <div><div className="eyebrow">DEVICE VIEW</div><h2>Ideal abrupt P–N junction</h2></div>
      <div className="transport-controls">
        <button onClick={() => setPlaying(value => !value)} aria-label={playing ? 'Pause schematic emphasis' : 'Play schematic emphasis'}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>
        <button onClick={restart} aria-label="Restart schematic emphasis"><RotateCcw size={15} /></button>
      </div>
    </div>
    {unavailable ? <div className="device-unavailable"><span>Junction visualization unavailable</span><small>The depletion model is outside its validity range for this bias.</small></div> : <><div className={`junction ${playing ? 'animate' : ''}`} key={animationKey} aria-label="Static schematic of the P-N junction">
      <div className="region neutral-region p-neutral">
        <div className="region-heading"><b>P-TYPE NEUTRAL</b><small>mobile holes</small></div>
        <ParticleField type="hole" sign="+" particles={neutralParticles} />
      </div>
      <div className="depletion p-depletion" style={{ width: `${pWidth}%` }}>
        <div className="region-heading"><b>P-SIDE DEPLETION</b><small>{pLabel ? `${p.toFixed(precision(p))} μm` : ''}</small></div>
        <ParticleField type="acceptor-ion" sign="−" particles={depletionIons} />
      </div>
      <div className="junction-line" aria-label="Metallurgical junction at x = 0"><span>x = 0</span></div>
      <div className="depletion n-depletion" style={{ width: `${nWidth}%` }}>
        <div className="region-heading"><b>N-SIDE DEPLETION</b><small>{nLabel ? `${n.toFixed(precision(n))} μm` : ''}</small></div>
        <ParticleField type="donor-ion" sign="+" particles={depletionIons} />
      </div>
      <div className="region neutral-region n-neutral">
        <div className="region-heading"><b>N-TYPE NEUTRAL</b><small>mobile electrons</small></div>
        <ParticleField type="electron" sign="−" particles={neutralParticles} />
      </div>
    </div>
    <div className="axis"><span>−{p.toFixed(precision(p))} μm</span><span>metallurgical junction, x = 0</span><span>+{n.toFixed(precision(n))} μm</span></div>
    <div className="rescale-note">Depletion span is rescaled for visibility; the P/N split remains proportional to the calculated widths · W = {total.toFixed(precision(total))} μm</div>
    <div className="device-legend" aria-label="Particle legend">
      <span><i className="legend-particle hole">+</i>mobile holes</span>
      <span><i className="legend-particle electron">−</i>mobile electrons</span>
      <span><i className="legend-particle acceptor-ion">−</i>fixed acceptor ions</span>
      <span><i className="legend-particle donor-ion">+</i>fixed donor ions</span>
    </div></>}
    <div className="animation-note">Schematic only: particles are static charge markers, not simulated trajectories. At thermal equilibrium, equal opposing mechanisms give zero net current.</div>
  </section>
}

function precision(value) {
  return value < 0.01 ? 3 : value < 0.1 ? 2 : 2
}
