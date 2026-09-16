import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const policyColors = ['#c56f2a','#8d7766','#6f7477','#b48a66'];
const candidateColors = ['#c56f2a','#6f7477','#9a826d'];
const themes = ['子育て','交通','医療','デジタル行政'];

function classify(text) {
  if (text.includes('質問主意書')) return '質問主意書';
  if (text.includes('提出') && !text.includes('予算案')) return '法案提出';
  if (/予算|議案|条例|決議|賛成/.test(text)) return '議案・予算等';
  return '質問';
}

function counts(policy) {
  const grouped = policy.activities.reduce((result, activity) => {
    const kind = activity.type || classify(activity.text);
    result[kind] = (result[kind] || 0) + 1;
    return result;
  }, {});
  return Object.entries(grouped).map(([kind,count]) => ({kind,count}));
}

function hasResponse(policy) {
  return policy.explanation !== '候補者からの回答はありません';
}

function verification(policy) {
  if (!policy.previous) return '実施主体・財源・開始時期を取材で確認します。過去比較や正誤判定は行いません。';
  if (policy.explanation.includes('回答')) return `${policy.sources[0]?.type || '公開資料'}で関連活動を確認。変更理由は資料から推測せず、候補者への取材事項として残しています。`;
  return `${policy.sources.map(s=>s.type).slice(0,2).join('・')}と過去発言を照合し、方針が変化した理由と実施条件を追加取材します。政策効果は判定しません。`;
}

function MapTooltip({ active, payload, mode }) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0].payload;
  const activeCounts = counts(item.policy).filter(x => x.count > 0);
  const summary = activeCounts.length ? activeCounts.map(x => `${x.kind}${x.count}件`).join(' / ') : item.policy.recordStatus;
  return <div className="map-tooltip interactive-tooltip">{mode === 'promise' && <span className="tooltip-candidate">{item.candidate.name}</span>}<strong>{item.policy.theme}</strong><span>状態：{item.policy.status || '初回立候補'}</span><span>確認記録：{summary}</span><b>クリックで詳細を見る</b></div>;
}

function pointKey(item) {
  return item ? `${item.candidate.id}-${item.policy.theme}` : '';
}

function LabeledPoint({ cx, cy, payload, selectedKey, onSelect, mode }) {
  if (!payload) return null;
  const selected = pointKey(payload) === selectedKey;
  const placeLeft = payload.x > 62 || payload.labelIndex % 4 === 2;
  const placeBelow = payload.y > 68 || payload.labelIndex % 4 === 1;
  const labelX = placeLeft ? cx - 14 : cx + 14;
  const labelY = placeBelow ? cy + 17 : cy - 17;
  const anchor = placeLeft ? 'end' : 'start';
  const lineX = placeLeft ? labelX + 4 : labelX - 4;
  const mainLabel = mode === 'candidate' ? payload.policy.theme : payload.candidate.name.replace(' ', '');
  const state = payload.policy.status || '初回立候補';
  const select = event => { event.stopPropagation(); onSelect(payload); };
  const labelWidth = Math.max(58, Math.min(96, Math.max(mainLabel.length * 10, state.length * 8) + 12));
  const bgX = placeLeft ? labelX - labelWidth - 4 : labelX - 4;
  return <g className={`rmpm-point${selected?' selected':''}`} role="button" tabIndex="0" aria-label={`${payload.candidate.name}、${payload.policy.theme}、${state}。クリックで詳細を固定表示`} onClick={select} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(event)}}}>
    <line x1={cx} y1={cy} x2={lineX} y2={labelY-2} stroke={selected?'#8f4b13':'#c8bcb3'} strokeWidth="1"/>
    {selected && <circle cx={cx} cy={cy} r="12" fill="none" stroke="#8f4b13" strokeWidth="2"/>}
    <circle cx={cx} cy={cy} r={selected?7:6} fill={payload.color} stroke="#fff" strokeWidth="2"/>
    {selected && <rect className="point-label-bg" x={bgX} y={labelY-12} width={labelWidth} height="29" rx="4" fill="#fff3e6"/>}
    <text x={labelX} y={labelY-1} textAnchor={anchor} fill="#403832" fontSize="9" fontWeight="700">{mainLabel}</text>
    <text x={labelX} y={labelY+11} textAnchor={anchor} fill={selected?'#8f4b13':'#716961'} fontSize="7.5">{state}</text>
  </g>;
}

function DetailPanel({ item, onSource, onClose }) {
  if (!item) return <div className="map-detail-empty"><span>気になる点を選んでください</span><p>「なぜこの位置なのか？」から、公約・説明・検証・一次資料へ進めます。</p></div>;
  const { candidate, policy } = item;
  const steps = policy.previous ? [
    ['2022年 前回公約', policy.previous],
    ['確認できる関連活動', counts(policy).length ? `${counts(policy).map(x=>`${x.kind} ${x.count}件`).join(' ／ ')}｜資料状況：${policy.recordMaterial}` : `${policy.recordStatus}｜${policy.recordNote}`],
    ['2026年 現在の方針', `${policy.current}｜状態：${policy.status}`],
    ['候補者本人の説明', policy.explanation],
    ['過去発言・報道アーカイブ', `2022年の前回公約、2024年の政策インタビュー、2026年の現在公約を時系列で照合。`],
    ['メディアによる検証・取材', verification(policy)],
  ] : [
    ['初回立候補', '今回が初回立候補のため、過去公約との比較対象はありません'],
    ['2026年 現在の方針', policy.current],
    ['候補者本人の説明', policy.explanation],
    ['過去発言・報道アーカイブ', '候補者アンケートと2026年の現在公約を時系列で確認。過去公約との比較は行いません。'],
    ['メディアによる検証・取材', verification(policy)],
  ];
  return <aside className="map-detail-panel" aria-live="polite"><header><div><span className="detail-question">なぜこの位置なのか？</span><span>{candidate.role}・架空候補者</span><h3>{candidate.name}</h3></div><div className="detail-actions"><span className="selected-policy">{policy.theme}</span><button onClick={onClose} aria-label="選択を解除">×</button></div></header><div className="accountability-steps">{steps.map(([label,text],i)=><section key={label}><i>{String(i+1).padStart(2,'0')}</i><div><small>{label}</small><p>{text}</p>{label.includes('関連活動') && <div className="inline-sources">{policy.sources.map(source=><button key={source.title} onClick={()=>onSource(source,policy)}>出典を見る：{source.type}</button>)}</div>}{label==='候補者本人の説明'&&!hasResponse(policy)&&<span className="response-facts">回答依頼：{policy.responseRequested}　／　最終確認：{policy.lastConfirmed}</span>}{label==='候補者本人の説明'&&<span className="response-principle">説明の有無は点数化しません。</span>}</div></section>)}<section><i>{String(steps.length+1).padStart(2,'0')}</i><div><small>根拠資料</small><p>一次資料の該当箇所と、公約に関連付けた理由を確認できます。</p><div className="inline-sources">{policy.sources.map(source=><button key={source.title} onClick={()=>onSource(source,policy)}>一次資料を確認 →</button>)}</div></div></section><section className="voter-step"><i>{String(steps.length+2).padStart(2,'0')}</i><div><small>有権者が判断</small><p>ここまでの情報を基に、最終的に判断するのは有権者です。</p></div></section></div></aside>;
}

export default function RmpmMap({ candidate, candidates, initialTheme, onSource }) {
  const [mode,setMode] = useState('candidate');
  const [theme,setTheme] = useState(initialTheme || '子育て');
  const [selected,setSelected] = useState(null);
  useEffect(()=>setTheme(initialTheme || '子育て'),[initialTheme]);
  useEffect(()=>setSelected(null),[mode,theme,candidate.id]);
  const data = useMemo(() => mode === 'candidate'
    ? candidate.policies.filter(p=>p.activityLevel !== null).map((policy,i)=>({x:policy.activityLevel,y:policy.centrality,policy,candidate,color:policyColors[i],labelIndex:i}))
    : candidates.map((person,i)=>({person,policy:person.policies.find(p=>p.theme===theme),color:candidateColors[i]})).filter(x=>x.policy.activityLevel !== null).map((x,i)=>({x:x.policy.activityLevel,y:x.policy.centrality,policy:x.policy,candidate:x.person,color:x.color,labelIndex:i})),[mode,theme,candidate,candidates]);
  const noComparison = mode === 'promise' ? candidates.filter(person=>{const policy=person.policies.find(p=>p.theme===theme);return policy?.activityLevel === null && !policy.previous}) : [];
  const unavailable = mode === 'candidate'
    ? candidate.policies.filter(policy=>policy.activityLevel === null && policy.previous).map(policy=>({candidate,policy,color:'#7b8791'}))
    : candidates.map(person=>({candidate:person,policy:person.policies.find(p=>p.theme===theme),color:'#7b8791'})).filter(item=>item.policy?.activityLevel === null && item.policy.previous);
  return <div className="rmpm-explorer">
    <div className="map-controls"><div className="mode-switch" aria-label="RMPMの見方を選ぶ"><button className={mode==='candidate'?'active':''} onClick={()=>setMode('candidate')}>候補者ごとに見る</button><button className={mode==='promise'?'active':''} onClick={()=>setMode('promise')}>公約テーマで比べる</button></div>{mode==='promise'&&<div className="map-theme-switch" aria-label="比べる公約テーマを選ぶ">{themes.map(t=><button className={theme===t?'active':''} onClick={()=>setTheme(t)} key={t}>{t}</button>)}</div>}</div>
    <div className="promise-mode-intro">{mode==='candidate'?<><strong>{candidate.name}候補の複数の公約を表示しています。</strong><span>1人の候補者について、複数の公約の位置を見るモードです。</span></>:<><strong>「{theme}」を掲げる複数の候補者を表示しています。</strong><span>1つの公約テーマについて、候補者同士の違いを見るモードです。</span></>}</div>
    <div className="map-alert compact-alert"><strong>この位置は候補者の優劣・誠実さ・政策の正しさを示すものではありません。</strong><span>右上ほど優秀という意味はなく、総合得点・達成率・順位を表しません。</span></div>
    <p className="mobile-chart-hint">横にスクロールして、軸と点の位置関係を確認できます →</p>
    <div className="chart-wrap interactive-chart" aria-label={mode==='candidate'?`${candidate.name}候補の複数の公約を見るRMPM`:`${theme}について複数の候補者を比べるRMPM`} onClick={event=>{if(!event.target.closest('.rmpm-point,.map-labels button'))setSelected(null)}}>
      <ResponsiveContainer width="100%" height={420}><ScatterChart margin={{top:48,right:92,bottom:64,left:68}}><CartesianGrid stroke="#e6e0da" strokeDasharray="3 5"/><XAxis type="number" dataKey="x" domain={[0,100]} ticks={[10,50,90]} tickFormatter={v=>v<34?'限定的':v<67?'複数':'継続的'} label={{value:'公開資料で確認できる記録の範囲 →',position:'bottom',offset:14,fill:'#625b55',fontSize:11}} tick={{fontSize:10,fill:'#77716b'}}/><YAxis type="number" dataKey="y" domain={[0,100]} ticks={[10,50,90]} tickFormatter={v=>v<34?'関連':v<67?'重点':'中心'} label={{value:'公約全体における政策の中心性 →',angle:-90,position:'insideLeft',offset:9,fill:'#625b55',fontSize:11}} tick={{fontSize:10,fill:'#77716b'}}/><Tooltip content={<MapTooltip mode={mode}/>} cursor={{stroke:'#c8b6a7',strokeDasharray:'3 4'}}/><Scatter data={data} shape={props=><LabeledPoint {...props} mode={mode} selectedKey={pointKey(selected)} onSelect={setSelected}/>} isAnimationActive={false}/></ScatterChart></ResponsiveContainer>
      <div className="map-labels">{data.map(item=><button className={selected?.candidate.id===item.candidate.id&&selected?.policy.theme===item.policy.theme?'active':''} onClick={()=>setSelected(item)} key={`${item.candidate.id}-${item.policy.theme}`}><i style={{background:item.color}}/>{mode==='candidate'?item.policy.theme:item.candidate.name}</button>)}{noComparison.map(person=>{const policy=person.policies.find(p=>p.theme===theme);const active=selected?.candidate.id===person.id&&selected?.policy.theme===theme;return <button className={`no-coordinate${active?' active':''}`} onClick={()=>setSelected({candidate:person,policy,color:'#9a826d'})} key={`${person.id}-${theme}`} aria-label={`${person.name}候補、初回立候補。過去公約との比較対象なし。詳細を見る`}><i/>{person.name}<small>初回立候補</small></button>})}</div>
    </div>
    {unavailable.map(item=><button className="newcomer-map-item unavailable-map-item" key={`${item.candidate.id}-${item.policy.theme}`} onClick={()=>setSelected(item)}><strong>{mode==='candidate'?item.policy.theme:item.candidate.name}・{item.policy.recordStatus}</strong><span>{item.policy.recordNote} 記録未公開を低い活動値に変換せず、散布図外に表示しています。詳細を見る →</span></button>)}
    <p className="map-entry-note">点は結論ではなく、問いの入口です。</p>
    <DetailPanel item={selected} onSource={onSource} onClose={()=>setSelected(null)}/>
  </div>;
}
