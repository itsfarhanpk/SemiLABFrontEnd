import { AlertTriangle, Atom, BookOpen, FlaskConical, LoaderCircle, Menu, Radio, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import ControlPanel from './components/ControlPanel'
import { BandChart, ChargeChart, DiodeChart, FieldChart } from './components/Charts'
import JunctionVisual from './components/JunctionVisual'
import MetricCard from './components/MetricCard'
import { DEFAULTS, useSimulation } from './hooks/useSimulation'

export default function App() {
  const [parameters, setParameters] = useState(DEFAULTS)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { result, status, error } = useSimulation(parameters)
  const material = useMemo(() => result?.material, [result])
  const reset = () => setParameters(DEFAULTS)
  return <div className="app-shell">
    <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button><div className="brand"><div className="logo"><Atom size={21} /></div><div><strong>SEMILAB</strong><span>VIRTUAL PHYSICS LAB</span></div></div><div className="top-title"><b>Interactive semiconductor physics</b><span>Explore Semiconductor Physics Through Interactive Simulations</span></div><nav><a className="active" href="#simulator">Simulator</a><a href="#theory">Theory</a><a href="#about">About</a></nav><div className="live"><i /> LIVE MODEL</div></header>
    <div className="layout">
      <div className={mobileOpen ? 'sidebar-wrap open' : 'sidebar-wrap'}><ControlPanel parameters={parameters} setParameters={setParameters} reset={reset} /></div>
      <main id="simulator" className="main-content">
        <div className="page-heading"><div><div className="eyebrow"><FlaskConical size={14} /> SIMULATION WORKSPACE</div><h1>P–N Junction <em>Explorer</em></h1><p>Analyze depletion behavior, electric fields, charge density, and ideal diode transport.</p></div><div className={`api-status ${status}`}><Radio size={14} /> {status === 'loading' ? 'CALCULATING' : status === 'ready' ? 'API CONNECTED' : 'API OFFLINE'}</div></div>
        {error && <div className="error-banner"><AlertTriangle size={18} /><span>{error}</span></div>}
        {status === 'loading' && !result && <div className="loading"><LoaderCircle className="spin" size={28} /><p>Running the junction model…</p></div>}
        {result && <><section className="metrics"><MetricCard label="Built-in potential" value={result.built_in_potential_v.toFixed(3)} unit="V" accent="cyan" /><MetricCard label="Depletion width" value={result.depletion_width_um?.toFixed(2)} unit="μm total" accent="purple" /><MetricCard label="Peak electric field" value={result.maximum_electric_field_v_per_m ? `${(result.maximum_electric_field_v_per_m / 1e5).toFixed(2)} × 10⁵` : '—'} unit="V/m" accent="orange" /><MetricCard label="Intrinsic density" value={result.intrinsic_concentration_cm3.toExponential(2)} unit="cm⁻³" accent="pink" /></section>
          {!result.valid && <div className="warning-banner"><AlertTriangle size={18} /><div><b>Model validity limit reached</b><span>{result.warnings[0]}</span></div></div>}
          {result.valid && result.warnings.length > 0 && <div className="notice"><Sparkles size={15} /> {result.warnings[0]}</div>}
          <JunctionVisual result={result} />
          <div className="charts-grid"><FieldChart result={result} /><BandChart result={result} /><ChargeChart result={result} /><DiodeChart result={result} /></div>
          <section id="theory" className="theory"><div className="eyebrow"><BookOpen size={14} /> MODEL NOTES</div><h2>Equations behind the simulation</h2><div className="theory-grid"><article><h3>Depletion approximation</h3><p>The abrupt-junction model assumes fixed ionized dopants inside the depletion region and negligible mobile charge there.</p><code>W = √[(2εs/q)(1/Na + 1/Nd)(Vbi − Va)]</code></article><article><h3>Ideal diode transport</h3><p>The I–V panel shows normalized current only. No geometry or saturation current is assumed, so it is not an absolute current measurement.</p><code>I/I₀ = exp(qVa/kBT) − 1</code></article><article><h3>{material?.name || 'Material'} model</h3><p>εr = {material?.relative_permittivity} · Eg(300 K) = {material?.band_gap_ev_300k} eV. Intrinsic density uses a documented temperature approximation.</p><code>ni(T) ≈ ni(300)(T/300)³ᐟ² exp[…]</code></article></div></section>
        </>}
      </main>
    </div>
  </div>
}
