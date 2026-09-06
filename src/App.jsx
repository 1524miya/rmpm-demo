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

function hasCandidateResponse(policy) {
  return policy.explanation !== '候補者からの回答はありません';
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

function archiveItems(policy) {
  const archiveSource = (type,title,date,excerpt) => ({type,title,date,excerpt,category:'架空の報道アーカイブ'});
  const items = [];
  if (policy.previous) items.push({year:'2022',medium:'選挙演説',quote:policy.previous,relation:'前回選挙で示した方針',source:archiveSource('選挙特集','福岡未来市選挙特集・候補者演説記録','2022.06.15',policy.previous)});
  items.push({year:policy.previous?'2024':'2025',medium:policy.previous?'記者インタビュー':'候補者アンケート',quote:policy.previous?`${policy.theme}について、制度と財源を確認しながら具体化を検討しています。`:policy.explanation.split('。')[0],relation:policy.previous?'現在公約へ至る検討過程':'今回の提案に至った問題意識',source:archiveSource(policy.previous?'ニュース記事':'候補者アンケート',policy.previous?'福岡未来ニュース・政策インタビュー':'福岡未来市民アンケート特集',policy.previous?'2024.08.03':'2025.11.20',policy.previous?`${policy.theme}について、制度と財源を確認しながら具体化を検討しています。`:policy.explanation.split('。')[0])});
  items.push({year:'2026',medium:'現在の公約',quote:policy.current,relation:'現在示している方針',source:archiveSource('今回選挙公報','2026年 福岡未来市長選挙公報','2026.09.01',policy.current)});
  return items;
}

function inquiryQuestion(policy) {
  if (!policy.previous) return 'この政策を重点として掲げた問題意識と、実現に必要な制度・財源をどう考えていますか？';
  if (policy.status === '継続') return '前回方針を継続しながら、今回具体化した点はどこですか？';
  if (policy.status === '優先順位変更') return '重点公約だった政策の優先順位と実施順序を変更した理由は何ですか？';
  return `前回の方針から「${policy.status}」とした理由と、判断に用いた情報は何ですか？`;
}

function comparisonInsights(policy) {
  if (!policy.previous) return {
    continuing: `${policy.theme}の課題を重点テーマに`,
    changed: `問題意識から「${policy.current}」へ具体化`,
  };
  if (policy.status === '継続') return {
    continuing: `${policy.theme}の課題対応を継続`,
    changed: `「${policy.current}」へ具体化`,
  };
  if (policy.status === '優先順位変更') return {
    continuing: `${policy.theme}を行政課題として継続`,
    changed: '一律目標から、利用頻度順の実施へ',
  };
  return {
    continuing: `${policy.theme}の課題認識を継続`,
    changed: `「${policy.current}」へ${policy.status}`,
  };
}

function mediaCheck(policy) {
  if (!policy.previous) return '過去比較は行わず、今回公約の背景と実現条件を取材で確認します。';
  return `${policy.sources.map(s => s.type).slice(0, 2).join('・')}と過去発言を照合し、変化の理由を確認する問いを整理しています。正誤判定ではありません。`;
}

function Header({ setView }) {
  return <header className="site-header">
    <button className="brand brand-button" onClick={() => setView('home')}>RMPM <span>福岡未来市長選 2026</span></button>
    <nav aria-label="主要ナビゲーション"><button onClick={() => setView('home')}>候補者</button><button onClick={() => setView('compare')}>政策比較</button><button onClick={() => setView('method')}>方法論・透明性</button></nav>
    <button className="menu-button" onClick={() => setView('method')} aria-label="方法論を開く">考え方</button>
  </header>;
}

function AccountabilityLoop() {
  const steps = [['01','過去公約'],['02','公開資料'],['03','発言アーカイブ'],['04','候補者説明'],['05','追加取材'],['06','有権者判断'],['07','次回選挙']];
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
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="閉じる">×</button><span className="source-type">{source.type}・{source.category || '架空の一次資料'}</span><h3 id="source-title">{source.title}</h3><time>{source.date}</time><dl className="source-detail"><div><dt>該当箇所</dt><dd>「{source.excerpt}」</dd></div><div><dt>関連付けた理由</dt><dd>「{policy.theme}」公約と同じ対象・制度について、過去または現在の確認可能な記述があるため。</dd></div></dl><p className="modal-note">この資料はWebデモ用に作成した架空資料です。実在の自治体・人物・媒体・文書とは関係ありません。</p></div></div>;
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

function ArchivePanel({ policy, onSource }) {
  const archive = archiveItems(policy); const past = archive[0]; const current = archive[archive.length-1]; const insight = comparisonInsights(policy);
  return <div className="archive-panel"><div className="archive-compare"><article><span>{past.year}　{past.medium}</span><blockquote>「<mark className="continuity-highlight">{past.quote}</mark>」</blockquote><button onClick={()=>onSource(past.source)}>出典を見る →</button></article><i>→</i><article><span>{current.year}　現在公約</span><blockquote>「<mark className="change-highlight">{current.quote}</mark>」</blockquote><button onClick={()=>onSource(current.source)}>出典を見る →</button></article></div><div className="insight-pair"><div className="continuing-point"><span>継続している点</span><strong>{insight.continuing}</strong></div><div className="changed-point"><span>{policy.previous ? '変化した点' : '新たに具体化された点'}</span><strong>{insight.changed}</strong></div></div><p className="ai-archive-note compact-ai-note">AI・テキストマイニングで関連候補を抽出し、人が関連性を確認しています。違いの善悪は判定しません。</p></div>;
}

function MediaInquiry({ policy, onSource }) {
  const insight = comparisonInsights(policy);
  const explanationSummary = policy.explanation === '候補者からの回答はありません'
    ? policy.explanation
    : `${policy.explanation.split('。')[0]}。`;
  const investigation = policy.previous
    ? '判断時期・財源・実施体制を追加取材します。'
    : '財源・人員配置・開始時期を追加取材します。';
  const steps = [
    [policy.previous ? '変化した点' : '新たに具体化された点', insight.changed, 'change'],
    ['取材で確認する問い', `「${inquiryQuestion(policy)}」`, 'question'],
    ['候補者説明', explanationSummary, 'explanation'],
    ['追加取材', investigation, 'investigation'],
  ];
  return <div className="media-inquiry"><div className="media-inquiry-flow">{steps.map(([label,text,tone],index)=><div className="media-step-wrap" key={label}><section className={`media-step media-step-${tone}`}><span>{String(index+1).padStart(2,'0')}　{label}</span><p>{text}</p></section><i aria-hidden="true">↓</i></div>)}<section className="media-step media-step-sources"><span>05　出典</span><p>判断の前に、確認に使った資料の該当箇所まで遡れます。</p><div>{policy.sources.map(source=><button key={source.title} onClick={()=>onSource(source)}>出典を見る：{source.type} →</button>)}</div></section></div><p className="media-role-note">変化は評価ではなく、説明・取材・根拠確認へ進む入口です。最終判断は有権者に委ねます。</p></div>;
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
      <section className="sequence-card explanation-card"><span className="step-tag">06 候補者本人の説明</span><p className={!hasCandidateResponse(policy) ? 'no-answer':''}>{hasCandidateResponse(policy) ? `「${policy.explanation}」` : policy.explanation}</p><div className="response-meta">{hasCandidateResponse(policy) ? <><span>本人回答を掲載</span><span>公開記録に表れない事情・今後の方針</span></> : <><span>回答依頼：{policy.responseRequested || '2026年8月18日'}</span><span>最終確認：{policy.lastConfirmed || '2026年8月29日'}</span></>}<span>掲載内容への訂正意見も受付</span></div><p className="explanation-incentive">回答の有無は点数化しません。説明を提供すると、記録だけでは分からない事情を有権者へ伝えられます。</p></section>
      <section className="sequence-card wide archive-card"><span className="step-tag">07 過去発言・報道アーカイブとの照合</span><span className="fiction-badge">架空のアーカイブ</span><ArchivePanel policy={policy} onSource={onSource}/></section>
      <section className="sequence-card wide media-card"><span className="step-tag">08 メディアによる検証・取材</span><span className="fiction-badge">架空の取材設計</span><MediaInquiry policy={policy} onSource={onSource}/></section>
      <section className="sequence-card wide source-card"><span className="step-tag">09 根拠資料</span><p className="source-lead">すべての表示から一次資料へ遡れます。</p><div className="source-buttons">{policy.sources.map(s=><button key={s.title} onClick={()=>onSource(s)}><span><b>{s.type}</b>{s.title}<small>{s.date}</small></span><Arrow/></button>)}</div></section>
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
  return <div className="page-shell"><div className="page-title"><span className="kicker">POLICY COMPARISON</span><h1>同じ政策でも、<br/>そこまでの経過は異なる。</h1><p>順位や点数ではなく、過去から現在までの経過と説明の違いを確認します。</p></div><div className="policy-tabs compare-tabs">{themes.map(t=><button className={theme===t?'active':''} key={t} onClick={()=>setTheme(t)}>{t}</button>)}</div><div className="compare-grid">{candidates.map(c=>{const p=c.policies.find(x=>x.theme===theme); return <article key={c.id}><header><span>{c.role}・架空候補者</span><h2>{c.name}</h2></header><dl><div><dt>前回公約</dt><dd>{p.previous || '今回が初回立候補のため、過去公約との比較対象はありません'}</dd></div><div><dt>今回公約</dt><dd>{p.current}</dd></div><div><dt>関連活動の種類</dt><dd>{p.previous ? activityCounts(p).filter(x=>x.count).map(x=><span key={x.kind}>{x.kind}　{x.count}件</span>) : '過去比較の対象となる活動は表示していません'}</dd></div><div><dt>公約履歴</dt><dd>{p.status ? `2022 前回公約 → 2026 ${p.status}` : '2026 初回立候補'}</dd></div><div><dt>候補者本人の説明</dt><dd><span className="presence">{hasCandidateResponse(p) ? '本人説明あり' : '回答なし'}</span>{p.explanation}{!hasCandidateResponse(p)&&<small className="comparison-response-date">回答依頼：{p.responseRequested} ／ 最終確認：{p.lastConfirmed}</small>}</dd></div><div><dt>メディア検証</dt><dd>{mediaCheck(p)}</dd></div></dl></article>})}</div><p className="compare-note">本人説明の有無は点数化しません。横並びは経過を確認するための表示であり、候補者の順位・達成率・総合評価を示すものではありません。</p></div>;
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
