import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const policyColors = ['#c56f2a','#8d7766','#6f7477','#b48a66'];
const candidateColors = ['#c56f2a','#6f7477','#9a826d'];
const themes = ['子育て','交通','医療','デジタル行政'];
const kinds = ['質問','質問主意書','法案提出','議案・予算等'];

function classify(text) {
  if (text.includes('質問主意書')) return '質問主意書';
  if (text.includes('提出') && !text.includes('予算案')) return '法案提出';
  if (/予算|議案|条例|決議|賛成/.test(text)) return '議案・予算等';
  return '質問';
}

function counts(policy) {
  return kinds.map(kind => ({ kind, count: policy.activities.filter(a => classify(a.text) === kind).length }));
}

function verification(policy) {
  if (!policy.previous) return '今回公約の記載内容と制度上の実施主体を確認。過去比較は行っていません。';
  if (policy.explanation.includes('回答')) return `${policy.sources[0]?.type || '公開資料'}で関連活動を確認。変更理由は資料から推測していません。`;
  return `${policy.sources.map(s=>s.type).slice(0,2).join('・')}と照合し、公約テーマとの関連を確認。政策効果は判定していません。`;
}

function MapTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0].payload;
  const summary = counts(item.policy).map(x => `${x.kind} ${x.count}`).join(' / ');
  return <div className="map-tooltip interactive-tooltip"><span className="tooltip-candidate">{item.candidate.name}</span><strong>{item.policy.theme}</strong><span>前回公約：{item.policy.previous || '初回立候補・過去比較なし'}</span><span>現在の状態：{item.policy.status || '初回立候補'}</span><span>関連活動：{summary}</span><b>クリックして、公約から説明・検証までを見る →</b></div>;
}

function DetailPanel({ item, onSource }) {
  if (!item) return <div className="map-detail-empty"><span>気になる点を選んでください</span><p>「なぜこの位置なのか？」から、公約・説明・検証・一次資料へ進めます。</p></div>;
  const { candidate, policy } = item;
  const steps = policy.previous ? [
    ['2022年 前回公約', policy.previous],
    ['確認できる関連活動', counts(policy).map(x=>`${x.kind} ${x.count}件`).join(' ／ ')],
    ['2026年 現在の方針', `${policy.current}｜状態：${policy.status}`],
    ['候補者本人の説明', policy.explanation],
    ['メディアによる検証', verification(policy)],
  ] : [
    ['初回立候補', '今回が初回立候補のため、過去公約との比較対象はありません'],
    ['2026年 現在の方針', policy.current],
    ['候補者本人の説明', policy.explanation],
    ['メディアによる検証', verification(policy)],
  ];
  return <aside className="map-detail-panel" aria-live="polite"><header><div><span>{candidate.role}・架空候補者</span><h3>{candidate.name}</h3></div><span className="selected-policy">{policy.theme}</span></header><div className="accountability-steps">{steps.map(([label,text],i)=><section key={label}><i>{String(i+1).padStart(2,'0')}</i><div><small>{label}</small><p>{text}</p>{label.includes('関連活動') && <div className="inline-sources">{policy.sources.map(source=><button key={source.title} onClick={()=>onSource(source,policy)}>出典を見る：{source.type}</button>)}</div>}</div></section>)}<section><i>{String(steps.length+1).padStart(2,'0')}</i><div><small>根拠資料</small><p>一次資料の該当箇所と、公約に関連付けた理由を確認できます。</p><div className="inline-sources">{policy.sources.map(source=><button key={source.title} onClick={()=>onSource(source,policy)}>一次資料を確認 →</button>)}</div></div></section><section className="voter-step"><i>{String(steps.length+2).padStart(2,'0')}</i><div><small>有権者が判断</small><p>ここまでの情報を基に、最終的に判断するのは有権者です。</p></div></section></div></aside>;
}

export default function RmpmMap({ candidate, candidates, initialTheme, onSource }) {
  const [mode,setMode] = useState('candidate');
  const [theme,setTheme] = useState(initialTheme || '子育て');
  const [selected,setSelected] = useState(null);
  useEffect(()=>setTheme(initialTheme || '子育て'),[initialTheme]);
  useEffect(()=>setSelected(null),[mode,theme,candidate.id]);
  const data = useMemo(() => mode === 'candidate'
    ? candidate.policies.filter(p=>p.activityLevel !== null).map((policy,i)=>({x:policy.activityLevel,y:policy.centrality,policy,candidate,color:policyColors[i]}))
    : candidates.map((person,i)=>({person,policy:person.policies.find(p=>p.theme===theme),color:candidateColors[i]})).filter(x=>x.policy.activityLevel !== null).map(x=>({x:x.policy.activityLevel,y:x.policy.centrality,policy:x.policy,candidate:x.person,color:x.color})),[mode,theme,candidate,candidates]);
  const noComparison = mode === 'promise' ? candidates.filter(person=>person.policies.find(p=>p.theme===theme)?.activityLevel === null) : [];
  return <div className="rmpm-explorer">
    <div className="map-controls"><div className="mode-switch" aria-label="RMPM表示モード"><button className={mode==='candidate'?'active':''} onClick={()=>setMode('candidate')}>候補者別</button><button className={mode==='promise'?'active':''} onClick={()=>setMode('promise')}>公約別</button></div>{mode==='promise'&&<div className="map-theme-switch" aria-label="政策テーマ">{themes.map(t=><button className={theme===t?'active':''} onClick={()=>setTheme(t)} key={t}>{t}</button>)}</div>}</div>
    {mode==='promise'&&<div className="promise-mode-intro"><strong>同じ政策を掲げていても、その経過や確認可能な活動は異なります。</strong><span>候補者間の違いを発見し、その理由を確認するための入口です。</span></div>}
    <div className="map-alert compact-alert"><strong>この位置は候補者の優劣・誠実さ・政策の正しさを示すものではありません。</strong><span>右上ほど優秀という意味はなく、総合得点・達成率・順位を表しません。</span></div>
    <div className="chart-wrap interactive-chart" aria-label={mode==='candidate'?`${candidate.name}の候補者別RMPM`:`${theme}の公約別RMPM`}>
      <ResponsiveContainer width="100%" height={380}><ScatterChart margin={{top:22,right:24,bottom:38,left:12}}><CartesianGrid stroke="#e6e0da" strokeDasharray="3 5"/><XAxis type="number" dataKey="x" domain={[0,100]} ticks={[10,50,90]} tickFormatter={v=>v<34?'限定的':v<67?'複数':'継続的'} label={{value:'公開資料から確認可能な関連活動 →',position:'bottom',offset:14,fill:'#625b55',fontSize:11}} tick={{fontSize:10,fill:'#77716b'}}/><YAxis type="number" dataKey="y" domain={[0,100]} ticks={[10,50,90]} tickFormatter={v=>v<34?'関連':v<67?'重点':'中心'} label={{value:'公約全体における政策の中心性 →',angle:-90,position:'insideLeft',offset:9,fill:'#625b55',fontSize:11}} tick={{fontSize:10,fill:'#77716b'}}/><Tooltip content={<MapTooltip/>} cursor={{stroke:'#c8b6a7',strokeDasharray:'3 4'}}/><Scatter data={data} onClick={point=>setSelected(point?.payload || point)} style={{cursor:'pointer'}}>{data.map(item=><Cell key={`${item.candidate.id}-${item.policy.theme}`} fill={item.color} stroke={selected?.candidate.id===item.candidate.id&&selected?.policy.theme===item.policy.theme?'#4a3424':'#fff'} strokeWidth={selected?.candidate.id===item.candidate.id&&selected?.policy.theme===item.policy.theme?5:3}/>)}</Scatter></ScatterChart></ResponsiveContainer>
      <div className="map-labels">{data.map(item=><button className={selected?.candidate.id===item.candidate.id&&selected?.policy.theme===item.policy.theme?'active':''} onClick={()=>setSelected(item)} key={`${item.candidate.id}-${item.policy.theme}`}><i style={{background:item.color}}/>{mode==='candidate'?item.policy.theme:item.candidate.name}</button>)}</div>
    </div>
    {noComparison.map(person=><button className="newcomer-map-item" key={person.id} onClick={()=>setSelected({candidate:person,policy:person.policies.find(p=>p.theme===theme),color:'#9a826d'})}><strong>{person.name}・初回立候補</strong><span>今回が初回立候補のため、過去公約との比較対象はありません。位置を低く見せないため散布図外に表示しています。詳細を見る →</span></button>)}
    <p className="map-entry-note">点は結論ではなく、問いの入口です。</p>
    <DetailPanel item={selected} onSource={onSource}/>
  </div>;
}
