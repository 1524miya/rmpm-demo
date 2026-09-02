'use client';
import { useState } from 'react';
import { candidates, themes, methodology } from '../data/mockData';
import RmpmMap from '../components/RmpmMap';

const Arrow = () => <span aria-hidden="true">→</span>;

function Header({ view, setView }) {
  return <header className="site-header"><button className="brand brand-button" onClick={()=>setView('home')}>RMPM <span>福岡未来市長選 2026</span></button><nav aria-label="主要ナビゲーション"><button onClick={()=>setView('home')}>候補者</button><button onClick={()=>setView('compare')}>政策比較</button><button onClick={()=>setView('method')}>方法論</button></nav><button className="menu-button" aria-label="メニュー">メニュー</button></header>;
}

function CandidateCards({ onSelect }) {
  return <section className="section" id="candidates"><div className="section-heading"><div><span className="kicker">福岡未来市 市長選挙</span><h2>候補者から見る</h2></div><p>すべての候補者・政党・資料はデモ用の架空データです。</p></div><div className="candidate-grid">{candidates.map((candidate,index)=><article className="candidate-card" key={candidate.id}><div className={`avatar avatar-${index+1}`}>{candidate.name.slice(0,1)}</div><div><span className="candidate-role">{candidate.role}</span><h3>{candidate.name}</h3><p>{candidate.firstTime ? '今回が初回立候補のため、過去公約との比較対象なし' : '前回公約と公開資料を4つの政策で確認'}</p></div><button onClick={()=>onSelect(candidate.id)}>この候補者を見る <Arrow /></button></article>)}</div></section>;
}

function Home({ onSelect, setView }) {
  return <><section className="hero" id="top"><div className="hero-copy"><div className="eyebrow">公約と公開資料をつなぐ、市民のための検証ツール</div><h1>その公約、<br/><em>前の選挙から何があった？</em></h1><p className="lead">公約を守ったかではなく、なぜ続けたのか、なぜ変えたのかを見る。</p><div className="hero-actions"><a className="button primary" href="#candidates">候補者を見る <span>↓</span></a><button className="text-link" onClick={()=>setView('method')}>RMPMの考え方</button></div></div><div className="hero-diagram" aria-label="RMPMの閲覧フロー"><span>過去の公約</span><i/><span>確認できる活動</span><i/><span>現在の公約</span><b>判断するのは、あなたです。</b></div><div className="hero-note"><strong>採点しません</strong><span>公開資料から確認できる事実を、判断の起点として整理します。</span></div></section><CandidateCards onSelect={onSelect}/><section className="principles"><span className="kicker">RMPMの前提</span><h2>位置は、評価ではありません。</h2><p>公約と確認可能な活動との距離を可視化し、候補者の説明・メディアの検証・あなた自身の判断につなげます。</p><button onClick={()=>setView('method')}>方法論を読む <Arrow/></button></section></>;
}

function SourceModal({ source, onClose }) {
  if (!source) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="閉じる">×</button><span className="source-type">{source.type}・架空資料</span><h3 id="source-title">{source.title}</h3><time>{source.date}</time><div className="document-paper"><span>抜粋</span><p>「{source.excerpt}」</p></div><p className="modal-note">この資料はWebデモ用に作成した架空の一次資料です。実在の自治体・人物・文書とは関係ありません。</p></div></div>;
}

function PolicyFlow({ policy, onSource }) {
  const noHistory = policy.previous === null;
  return <article className="policy-flow"><div className="flow-head"><div><span className="theme-chip">{policy.theme}</span><h3>{policy.current}</h3></div>{policy.status && <span className="status-chip">{policy.status}</span>}</div>{noHistory ? <div className="first-candidate"><strong>過去比較なし</strong><p>今回が初回立候補のため、過去公約との比較対象なし</p></div> : <div className="flow-grid"><section><span className="flow-number">01</span><small>前回公約</small><h4>「{policy.previous}」</h4><p>{policy.positioning}</p></section><div className="flow-arrow">→</div><section><span className="flow-number">02</span><small>公開資料から確認できる関連活動</small><ul>{policy.activities.map(a=><li key={a.year+a.text}><time>{a.year}</time><span>{a.text}</span></li>)}</ul></section><div className="flow-arrow">→</div><section className="current-box"><span className="flow-number">03</span><small>今回の公約</small><h4>「{policy.current}」</h4></section></div>}<div className="explanation"><span>候補者の説明</span><p className={policy.explanation.includes('回答') ? 'no-answer':''}>「{policy.explanation}」</p></div><div className="sources"><div><span>根拠資料</span><small>公開資料から確認できた内容のみを表示</small></div><div className="source-buttons">{policy.sources.map(s=><button key={s.title} onClick={()=>onSource(s)}><span><b>{s.type}</b>{s.title}</span><Arrow/></button>)}</div></div></article>;
}

function CandidateDetail({ candidateId, onBack }) {
  const candidate = candidates.find(c=>c.id===candidateId) || candidates[0];
  const [theme,setTheme] = useState('子育て'); const [source,setSource] = useState(null);
  const policy = candidate.policies.find(p=>p.theme===theme);
  return <><div className="detail-shell"><button className="back-button" onClick={onBack}>← 候補者一覧</button><section className="profile"><div className="profile-mark" style={{background:candidate.color}}>{candidate.name.slice(0,1)}</div><div><span>{candidate.role} ／ {candidate.age}歳</span><h1>{candidate.name}</h1><p>{candidate.tagline}</p></div><div className="fiction-label">架空の候補者</div></section><div className="policy-tabs" role="tablist" aria-label="政策テーマ">{themes.map(t=><button role="tab" aria-selected={theme===t} className={theme===t?'active':''} key={t} onClick={()=>setTheme(t)}>{t}</button>)}</div><section className="detail-intro"><span>公約の変化をたどる</span><h2>{theme}</h2><p>過去の公約から現在までを、公開資料と候補者の説明に沿って並べています。</p></section><PolicyFlow policy={policy} onSource={setSource}/><section className="map-section"><div className="map-heading"><div><span className="kicker">RELATIVE POSITIONING</span><h2>RMPMマップ</h2></div><p>{candidate.name}の4政策を、公開資料で確認できる活動と公約内の中心性で配置します。</p></div><RmpmMap candidate={candidate}/><p className="map-disclaimer">この位置は候補者の優劣や誠実さを示すものではありません。公約と確認可能な活動との関係を確認するための起点です。</p></section></div><SourceModal source={source} onClose={()=>setSource(null)}/></>;
}

function Compare() {
  const [theme,setTheme] = useState('子育て');
  return <div className="page-shell"><div className="page-title"><span className="kicker">POLICY COMPARISON</span><h1>同じ政策を、横に並べて見る。</h1><p>順位や点数ではなく、それぞれの公約・活動・説明の違いを確認します。</p></div><div className="policy-tabs compare-tabs">{themes.map(t=><button className={theme===t?'active':''} key={t} onClick={()=>setTheme(t)}>{t}</button>)}</div><div className="compare-grid">{candidates.map(c=>{const p=c.policies.find(x=>x.theme===theme); return <article key={c.id}><header><span>{c.role}</span><h2>{c.name}</h2></header><dl><div><dt>今回の公約</dt><dd>{p.current}</dd></div><div><dt>過去公約</dt><dd>{p.previous || '今回が初回立候補のため、過去公約との比較対象なし'}</dd></div><div><dt>関連活動</dt><dd>{p.activities.length ? p.activities.map(a=><span key={a.text}>{a.year}　{a.text}</span>) : '過去比較の対象となる活動は表示していません'}</dd></div><div><dt>候補者説明</dt><dd><span className="presence">{p.explanation.includes('回答') ? '回答なし' : p.previous ? '説明あり' : '過去比較なし'}</span>{p.explanation}</dd></div></dl></article>})}</div><p className="compare-note">横並びは比較のための表示であり、候補者の順位を示すものではありません。</p></div>;
}

function Method() {
  return <div className="page-shell method-page"><div className="page-title"><span className="kicker">METHODOLOGY</span><h1>判断の材料を、<br/>一次資料までひらく。</h1><p>RMPMは政治家を採点するのではなく、公約と確認可能な活動をつなぐための方法です。</p></div><div className="method-grid">{methodology.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h2>{title}</h2><p>{text}</p></article>)}</div><section className="ai-note"><div><span>AIの役割</span><h2>探す補助。<br/>判断はしない。</h2></div><p>AIは大量の公開資料から、公約に関連する可能性のある記述を探すために使います。人が一次資料を確認し、候補者の正しさ・誠実さをAIが判定することはありません。最終的な判断は、資料と説明を見たユーザーに委ねます。</p></section></div>;
}

export default function App() {
  const [view,setView] = useState('home'); const [candidateId,setCandidateId] = useState('tanaka');
  const selectCandidate=id=>{setCandidateId(id);setView('candidate');window.scrollTo(0,0)};
  const changeView=v=>{setView(v);window.scrollTo(0,0)};
  return <main><Header view={view} setView={changeView}/>{view==='home'&&<Home onSelect={selectCandidate} setView={changeView}/>} {view==='candidate'&&<CandidateDetail candidateId={candidateId} onBack={()=>changeView('home')}/>} {view==='compare'&&<Compare/>} {view==='method'&&<Method/>}<footer><div className="brand">RMPM</div><p>Relative Political Manifesto Positioning Map</p><span>本サイトの人物・自治体・資料はすべて架空です。</span></footer></main>;
}
