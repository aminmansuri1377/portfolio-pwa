import { useId } from 'react';
import s from '../../styles/visual-lab.module.css';

// Lightweight, original vector/CSS covers. Gallery cards never create WebGL contexts.
export default function LabArtwork({ kind }) {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={`${s.artwork} ${s[`art_${kind}`]}`} aria-hidden="true">
      {kind === 'aura' && <>
        <span className={s.artWord}>aura.</span>
        <div className={s.headphones}><i className={s.headband} /><i className={s.innerBand} /><i className={s.earLeft} /><i className={s.earRight} /><i className={s.earShine} /></div>
        <span className={s.artSub}>SOUND. REIMAGINED.</span>
        <div className={s.artSwatches}><i /><i /><i /></div>
      </>}
      {kind === 'folio' && <>
        <span className={s.folioLabel}>FORM / FEELING</span>
        <div className={s.folioSun} /><div className={s.folioArch} /><div className={s.folioArchSecond} />
        <span className={s.folioType}>A different<br /><em>perspective.</em></span>
        <span className={s.folioMark}>F.</span>
      </>}
      {kind === 'pulse' && <div className={s.miniDashboard}>
        <div className={s.miniNav}><b>pulse<span>®</span></b><i /><i /><i /></div>
        <div className={s.miniDashboardBody}><span>Overview</span><strong>€24,890<span>+18.6%</span></strong>
          <svg viewBox="0 0 400 150" fill="none"><defs><linearGradient id={`${uid}chart`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#bfff3c" stopOpacity=".35"/><stop offset="1" stopColor="#bfff3c" stopOpacity="0"/></linearGradient></defs><path d="M0 123 C24 123 25 92 48 96 S77 131 102 98 S132 82 151 80 S180 108 200 67 S227 78 250 49 S281 58 304 31 S339 52 358 21 S384 26 400 5 V150 H0Z" fill={`url(#${uid}chart)`}/><path d="M0 123 C24 123 25 92 48 96 S77 131 102 98 S132 82 151 80 S180 108 200 67 S227 78 250 49 S281 58 304 31 S339 52 358 21 S384 26 400 5" stroke="#bfff3c" strokeWidth="3"/></svg>
          <div className={s.miniMetrics}><i>Sessions<b>8,462</b></i><i>Conversion<b>4.82%</b></i><i>Customers<b>1,204</b></i></div>
        </div>
      </div>}
      {kind === 'flux' && <><span className={s.fluxWord}>flux</span><div className={s.fluxForm}>{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div><span className={s.artSub}>FORM IS A FEELING.</span></>}
      {kind === 'kinetic' && <><div className={s.kineticGrid}/><div className={s.kineticObject}><i /><i /><i /><i /></div><span className={s.kineticType}>Move<br /><em>something.</em></span><span className={s.kineticCursor}>✦</span></>}
      {kind === 'atelier' && <><span className={s.atelierWord}>atelier</span><div className={s.lamp}><i className={s.lampShade}/><i className={s.lampStem}/><i className={s.lampBase}/></div><span className={s.atelierCaption}>LESS, BUT LOVELIER.</span><span className={s.atelierCircle}>a</span></>}
      {kind === 'orbit' && <><span className={s.orbitWord}>O R B I T</span><svg viewBox="0 0 500 320" className={s.galaxy}><defs><radialGradient id={`${uid}galaxy`}><stop stopColor="#d7d0ff" stopOpacity=".8"/><stop offset=".12" stopColor="#9e8aff" stopOpacity=".3"/><stop offset="1" stopColor="#7b61ff" stopOpacity="0"/></radialGradient></defs><ellipse cx="250" cy="160" rx="230" ry="145" fill={`url(#${uid}galaxy)`}/>{Array.from({ length: 220 }, (_, i) => { const r = 8 + Math.sqrt(i / 220) * 205; const a = i * 2.399963 + r * .012; return <circle key={i} cx={250 + Math.cos(a) * r} cy={160 + Math.sin(a) * r * .48} r={i % 9 === 0 ? 1.8 : .9} fill={i % 3 === 0 ? '#bfff3c' : '#d4caff'} opacity={.3 + (i % 7) * .1}/>; })}</svg><i className={s.orbitRing}/><span className={s.artSub}>A UNIVERSE WITHIN REACH.</span></>}
      {kind === 'palette' && <><span className={s.paletteTop}>TYPE AS EXPRESSION</span><div className={s.paletteText}>Aa<span>&</span>Bb.</div><div className={s.paletteSwatches}><i/><i/><i/><i/></div></>}
      {kind === 'relay' && <div className={s.miniBoard}><div className={s.boardTitle}>relay<span>Workspace / Design</span></div><div className={s.boardCols}>{['Planned', 'In progress', 'Complete'].map((title, i) => <div key={title}><span>{title}</span>{[0, 1].map(n => <div className={`${s.boardCard} ${i === 1 && n === 0 ? s.boardFloat : ''}`} key={n}><i style={{ background: ['#a4a1ff','#bfff3c','#89d6bd'][(i+n)%3] }}/><b>{[['Design system', 'Landing page'],['Explore motion', 'Review layouts'],['Brand direction', 'Set the mood']][i][n]}</b><small>◉ <span>◌ ◌</span></small></div>)}</div>)}</div></div>}
    </div>
  );
}
