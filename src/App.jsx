import { useEffect, useState } from 'react';
import { candidates, themes, methodology } from './data/mockData';
import RmpmMap from './components/RmpmMap';

const Arrow = () => <span aria-hidden="true">→</span>;
const activityKinds = ['質問', '質問主意書', '法案提出・共同提出', '議案・予算等への関与'];

function classifyActivity(text) {
  if (text.includes('質問主意書')) return '質問主意書';
  if (text.includes('提出') && !text.includes('予算案')) return '法案提出・共同提出';
  if (/予算|議案|条例|決議|賛成/.test(text)) return '議案・予算等への関与';
  return '質問';
}

function activityCounts(policy) {
  return activityKinds.map(kind => ({ kind, count: policy.activities.filter(a => classifyActivity(a.text) === kind).length }));
}

function centralityLabel(policy) {
  if (!policy.positioning) return '今回の公約での位置づけ';
  return policy.positioning;
}

function responsibilityFor(theme) {
  if (theme === '交通') return '複数主体';
  if (theme === '医療') return '政府・行政';
  return '候補者個人';
}

function mediaCheck(policy) {
  if (!policy.previous) return '過去比較の対象がないため、今回は公約の記載内容と制度上の実施主体を確認しました。';
  if (policy.explanation.includes('回答')) return `関連する${policy.sources[0]?.type || '公開資料'}は確認できました。変更理由については候補者本人の回答がなく、資料から推測していません。`;
  return `${policy.sources.map(s => s.type).slice(0, 2).join('と')}を照合し、記載された活動が公約テーマに関連することを確認しました。説明内容の妥当性や政策の効果は判定していません。`;
}

function Header({ setView }) {
  return <header className="site-header">
    <button className="brand brand-button" onClick={() => setView('home')}>RMPM <span>福岡未来市長選 2026</span></button>
    <nav aria-label="主要ナビゲーション"><button onClick={() => setView('home')}>候補者</button><button onClick={() => setView('compare')}>政策比較</button><button onClick={() => setView('method')}>方法論・透明性</button></nav>
    <button className="menu-button" onClick={() => setView('method')} aria-label="方法論を開く">考え方</button>
  </header>;
}

function AccountabilityLoop() {
  const steps = [['01','過去公約'],['02','関連活動'],['03','候補者説明'],['04','メディア検証'],['05','有権者判断'],['06','次回選挙']];
  return <div className="accountability-block">
    <div className="loop-title"><span>政治公約・説明責任連動構造</span><p>公開記録を「答え」ではなく、説明を求めるための「問い」にする。</p></div>
    <div className="accountability-loop" aria-label="政治公約・説明責任連動構造">
      {steps.map(([no,label],index) => <div className="loop-part" key={label}><div className="loop-node"><small>{no}</small><strong>{label}</strong></div>{index < steps.length - 1 && <span className="loop-arrow">→</span>}</div>)}
    </div>
  </div>;
}

function CandidateCards({ onSelect }) {
  return <section className="section" id="candidates"><div className="section-heading"><div><span className="kicker">福岡未来市 市長選挙</span><h2>候補者から公約の経過を見る</h2></div><p>すべての候補者・政党・資料はデモ用の架空データです。</p></div><div className="candidate-grid">{candidates.map((candidate,index)=><article className="candidate-card" key={candidate.id}><div className={`avatar avatar-${index+1}`}>{candidate.name.slice(0,1)}</div><div><span className="candidate-role">{candidate.role}・架空候補者</span><h3>{candidate.name}</h3><p>{candidate.firstTime ? '今回が初回立候補のため、過去公約との比較対象はありません' : '前回公約から現在までを、4つの政策テーマで確認'}</p></div><button onClick={()=>onSelect(candidate.id)}>公約の経過を見る <Arrow /></button></article>)}</div></section>;
}

function Home({ onSelect, setView }) {
  return <><section className="hero" id="top"><div className="hero-copy"><div className="eyebrow">公約と公開資料をつなぐ、市民のための検証ツール</div><h1>その公約、<br/><em>前の選挙から何があった？</em></h1><p className="lead">公約を守ったかではなく、なぜ続けたのか、なぜ変えたのかを見る。</p><p className="hero-summary">選挙時の新しい公約だけでなく、過去の公約、その後の活動、変更理由、根拠資料まで一つにつなげて確認できる政治情報基盤です。</p><div className="hero-actions"><a className="button primary" href="#candidates">RMPMを見る <span>↓</span></a><button className="text-link" onClick={()=>setView('method')}>なぜランキングではない？</button></div></div><div className="hero-question"><span>RMPMが示すのは</span><strong>評価ではなく、<br/>説明を始めるための問い。</strong><p>活動が少ないことを、公約を破った証拠とは扱いません。</p></div></section><AccountabilityLoop/><CandidateCards onSelect={onSelect}/><section className="principles"><span className="kicker">RMPMの前提</span><h2>位置は、評価ではありません。</h2><p>公約と確認可能な活動との関係を可視化し、候補者の説明、メディアの検証、あなた自身の判断につなげます。</p><button onClick={()=>setView('method')}>方法論と限界を読む <Arrow/></button></section><PrototypeTest/></>;
}

function SourceModal({ source, policy, onClose }) {
  useEffect(() => { const onKey = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  if (!source) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="閉じる">×</button><span className="source-type">{source.type}・架空の一次資料</span><h3 id="source-title">{source.title}</h3><time>{source.date}</time><dl className="source-detail"><div><dt>該当箇所</dt><dd>「{source.excerpt}」</dd></div><div><dt>関連付けた理由</dt><dd>「{policy.theme}」公約と同じ対象・制度について、候補者または行政の確認可能な関与が記録されているため。</dd></div></dl><p className="modal-note">この資料はWebデモ用に作成した架空の一次資料です。実在の自治体・人物・文書とは関係ありません。</p></div></div>;
}

function ActivityPanel({ policy, onSource }) {
  const counts = activityCounts(policy);
  if (!policy.previous) return <div className="first-candidate compact"><strong>過去比較の対象となる活動は表示していません</strong><p>今回が初回立候補であり、既存候補との活動量比較は行いません。</p></div>;
  return <div><div className="activity-counts">{counts.map(({kind,count})=><div key={kind}><span>{kind}</span><strong>{count}<small>件</small></strong></div>)}</div><ul className="activity-list">{policy.activities.map((a,i)=><li key={a.year+a.text}><time>{a.year}</time><span><b>{classifyActivity(a.text)}</b>{a.text}</span>{policy.sources[i] && <button onClick={()=>onSource(policy.sources[i])}>出典を見る</button>}</li>)}</ul><p className="count-note">種類別の確認件数です。合計点や活動の質を示すものではありません。</p></div>;
}

function HistoryTimeline({ policy }) {
  if (!policy.previous) return <div className="history-timeline"><div><time>2026</time><span className="timeline-dot"/><p><small>初回立候補</small>「{policy.current}」</p></div></div>;
  const middle = policy.activities.map(a => ({year:a.year,label:classifyActivity(a.text),text:a.text}));
  const items = [{year:'2022',label:'前回公約',text:policy.previous},...middle,{year:'2026',label:policy.status,text:policy.current}];
  return <div className="history-timeline">{items.map((item,i)=><div key={`${item.year}-${i}`}><time>{item.year}</time><span className="timeline-dot"/><p><small>{item.label}</small>「{item.text}」</p></div>)}</div>;
}

function PolicyFlow({ policy, onSource }) {
  const noHistory = policy.previous === null;
  return <article className="policy-flow"><div className="flow-head"><div><span className="theme-chip">{policy.theme}</span><h3>{policy.current}</h3><span className="responsibility">主な責任主体：{responsibilityFor(policy.theme)}</span></div>{policy.status && <span className="status-chip">{policy.status}</span>}</div>
    {noHistory && <div className="first-candidate"><strong>過去公約との比較対象なし</strong><p>今回が初回立候補のため、過去公約との比較対象はありません。</p></div>}
    <div className="evidence-sequence">
      <section className="sequence-card"><span className="step-tag">01 前回の公約</span><h4>{policy.previous ? `「${policy.previous}」` : '今回が初回立候補'}</h4></section>
      <section className="sequence-card"><span className="step-tag">02 当時の中心性</span><h4>{centralityLabel(policy)}</h4><p>数値や候補者間順位ではなく、公約内での記載上の位置づけです。</p></section>
      <section className="sequence-card wide"><span className="step-tag">03 公開資料から確認できる関連活動</span><ActivityPanel policy={policy} onSource={onSource}/></section>
      <section className="sequence-card current-box"><span className="step-tag">04 現在の公約</span><h4>「{policy.current}」</h4>{policy.status && <span className="history-state">前回から：{policy.status}</span>}</section>
      <section className="sequence-card wide"><span className="step-tag">05 公約履歴</span><HistoryTimeline policy={policy}/></section>
      <section className="sequence-card explanation-card"><span className="step-tag">06 候補者本人の説明</span><p className={policy.explanation.includes('回答') ? 'no-answer':''}>「{policy.explanation}」</p><div className="response-meta"><span>回答依頼：2026年8月18日</span><span>掲載内容への訂正意見も受付</span></div></section>
      <section className="sequence-card media-card"><span className="step-tag">07 メディアによる検証</span><span className="fiction-badge">架空の検証</span><p>{mediaCheck(policy)}</p><small>候補者説明とは独立して表示しています。</small></section>
      <section className="sequence-card wide source-card"><span className="step-tag">08 根拠資料</span><p className="source-lead">すべての表示から一次資料へ遡れます。</p><div className="source-buttons">{policy.sources.map(s=><button key={s.title} onClick={()=>onSource(s)}><span><b>{s.type}</b>{s.title}<small>{s.date}</small></span><Arrow/></button>)}</div></section>
    </div>
  </article>;
}

function CandidateDetail({ candidateId, onBack }) {
  const candidate = candidates.find(c=>c.id===candidateId) || candidates[0];
  const [theme,setTheme] = useState('子育て'); const [sourceSelection,setSourceSelection] = useState(null);
  const policy = candidate.policies.find(p=>p.theme===theme);
  return <><div className="detail-shell"><button className="back-button" onClick={onBack}>← 候補者一覧</button><section className="profile"><div className="profile-mark" style={{background:candidate.color}}>{candidate.name.slice(0,1)}</div><div><span>{candidate.role} ／ {candidate.age}歳</span><h1>{candidate.name}</h1><p>{candidate.tagline}</p></div><div className="fiction-label">架空の候補者</div></section><div className="policy-tabs" role="tablist" aria-label="政策テーマ">{themes.map(t=><button role="tab" aria-selected={theme===t} className={theme===t?'active':''} key={t} onClick={()=>setTheme(t)}>{t}</button>)}</div><section className="detail-intro"><span>公約から説明までを一つにつなぐ</span><h2>{theme}</h2><p>番号順にたどると、公開記録を起点に候補者説明と第三者検証まで確認できます。</p></section><PolicyFlow policy={policy} onSource={sourceItem=>setSourceSelection({source:sourceItem,policy})}/><section className="map-section"><div className="map-heading"><div><span className="kicker">相対的政治公約位置地図</span><h2>RMPM</h2><small className="map-full-name">Relative Political Manifesto Positioning Map</small></div><p>1点は「一人の候補者 × 一つの公約」。活動量の総合点や候補者ランキングではありません。</p></div><p className="map-disclaimer">公開資料に表れない交渉・役職・権限・与野党の立場・社会情勢等は、この図だけでは評価できません。</p><RmpmMap candidate={candidate} candidates={candidates} initialTheme={theme} onSource={(sourceItem,sourcePolicy)=>setSourceSelection({source:sourceItem,policy:sourcePolicy})}/></section></div><SourceModal source={sourceSelection?.source} policy={sourceSelection?.policy || policy} onClose={()=>setSourceSelection(null)}/></>;
}

function Compare() {
  const [theme,setTheme] = useState('子育て');
  return <div className="page-shell"><div className="page-title"><span className="kicker">POLICY COMPARISON</span><h1>同じ政策でも、<br/>そこまでの経過は異なる。</h1><p>順位や点数ではなく、過去から現在までの経過と説明の違いを確認します。</p></div><div className="policy-tabs compare-tabs">{themes.map(t=><button className={theme===t?'active':''} key={t} onClick={()=>setTheme(t)}>{t}</button>)}</div><div className="compare-grid">{candidates.map(c=>{const p=c.policies.find(x=>x.theme===theme); return <article key={c.id}><header><span>{c.role}・架空候補者</span><h2>{c.name}</h2></header><dl><div><dt>前回公約</dt><dd>{p.previous || '今回が初回立候補のため、過去公約との比較対象はありません'}</dd></div><div><dt>今回公約</dt><dd>{p.current}</dd></div><div><dt>関連活動の種類</dt><dd>{p.previous ? activityCounts(p).filter(x=>x.count).map(x=><span key={x.kind}>{x.kind}　{x.count}件</span>) : '過去比較の対象となる活動は表示していません'}</dd></div><div><dt>公約履歴</dt><dd>{p.status ? `2022 前回公約 → 2026 ${p.status}` : '2026 初回立候補'}</dd></div><div><dt>候補者説明</dt><dd><span className="presence">{p.explanation.includes('回答') ? '回答なし' : p.previous ? '説明あり' : '過去比較なし'}</span>{p.explanation}</dd></div><div><dt>メディア検証</dt><dd>{mediaCheck(p)}</dd></div></dl></article>})}</div><p className="compare-note">横並びは経過を確認するための表示であり、候補者の順位・達成率・総合評価を示すものではありません。</p></div>;
}

function Method() {
  const notMeasured = ['政策の正しさ','政治家の人格・総合能力','非公開交渉','質問や法案の質','政策の社会的効果'];
  const limits = ['水面下の交渉','危機管理','活動の質','SNS・メディアでの理解促進','政策の実際の社会的効果','AI分類の誤り','政策そのものの妥当性'];
  return <div className="page-shell method-page"><div className="page-title"><span className="kicker">METHODOLOGY & TRANSPARENCY</span><h1>答えを出すのではなく、<br/>問いの根拠をひらく。</h1><p>RMPMは政治家を採点せず、公約と確認可能な活動の関係を説明可能にする方法です。</p></div><div className="measure-grid"><section><span>測定するもの</span><h2>公約と公開活動の関係</h2><p>公開資料で確認できる活動が、どの公約に関連する可能性があるかを整理します。</p></section><section><span>測定しないもの</span><div className="tag-list">{notMeasured.map(x=><i key={x}>{x}</i>)}</div></section></div><div className="method-grid">{methodology.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h2>{title}</h2><p>{text}</p></article>)}</div><section className="ai-note"><div><span>AIの役割</span><h2>探す補助。<br/>判断はしない。</h2></div><p>AIは過去公約、議事録、演説、公開資料から関連する可能性のある記録を探す検索・分類補助です。最終的な関連付けは人が一次資料と公開基準を確認します。AIが政治家を採点・評価・判定することはありません。</p></section><section className="transparency-section"><div><span className="kicker">TRANSPARENCY</span><h2>検証可能な運用にする</h2></div><div className="transparency-items">{['使用資料','分類基準','候補者確認','訂正請求','修正履歴'].map(x=><span key={x}>✓ {x}</span>)}</div></section><section className="operator-section"><div><span className="kicker">想定する実装主体</span><h2>公共性と取材力を持つ主体へ</h2></div><div><h3>有力候補：NHK</h3><p>全国規模の選挙報道基盤、政治的公平性への強い要請、候補者へ回答を促す取材力、次回選挙まで情報を接続できる継続性が理由です。</p><p>ただしNHKだけを前提とせず、他の報道機関、研究機関、自治体、選挙情報団体との共同運営も想定します。運営主体の公平性を自動的に保証するものではなく、RMPM固有の分類基準・使用資料・訂正請求・修正履歴を公開します。</p></div></section><section className="limits-section"><div><span className="kicker">本ツールの限界</span><h2>見えないものを、<br/>見えたことにしない。</h2><p>だから候補者本人の説明と、メディアによる検証が必要です。</p></div><div className="limit-list">{limits.map(x=><span key={x}>{x}</span>)}</div></section><PrototypeTest/></div>;
}

function PrototypeTest() {
  const goals = ['ランキングとして誤解されないか','公約と活動の関係を理解できるか','候補者説明まで見てもらえるか','メディア検証まで参照されるか','投票判断の材料が増えたと感じるか'];
  return <section className="prototype-test"><span>この試作で検証したいこと</span><div>{goals.map(goal=><p key={goal}>□ {goal}</p>)}</div></section>;
}

export default function App() {
  const [view,setView] = useState('home'); const [candidateId,setCandidateId] = useState('tanaka');
  const changeView=v=>{setView(v);window.scrollTo(0,0)};
  const selectCandidate=id=>{setCandidateId(id);changeView('candidate')};
  return <main><Header setView={changeView}/>{view==='home'&&<Home onSelect={selectCandidate} setView={changeView}/>} {view==='candidate'&&<CandidateDetail candidateId={candidateId} onBack={()=>changeView('home')}/>} {view==='compare'&&<Compare/>} {view==='method'&&<Method/>}<footer><div className="brand">RMPM</div><p>Relative Political Manifesto Positioning Map<br/>相対的政治公約位置地図</p><span>本サイトの人物・自治体・資料はすべて架空です。</span></footer></main>;
}
