import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

function MapTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0].payload;
  return <div className="map-tooltip"><strong>{item.theme}</strong><span>関連活動 {item.x}</span><span>政策の中心性 {item.y}</span></div>;
}

export default function RmpmMap({ candidate }) {
  const data = candidate.policies.filter(p => p.activityLevel !== null).map(p => ({ x:p.activityLevel, y:p.centrality, theme:p.theme, status:p.status }));
  if (!data.length) return <div className="map-empty"><strong>比較対象なし</strong><p>今回が初回立候補のため、過去公約と確認可能な活動の位置は表示していません。</p></div>;
  return (
    <div className="chart-wrap" aria-label={`${candidate.name}のRMPMマップ`}>
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{top:18,right:22,bottom:34,left:10}}>
          <CartesianGrid stroke="#e6e0da" strokeDasharray="3 5" />
          <XAxis type="number" dataKey="x" domain={[0,100]} ticks={[0,25,50,75,100]} label={{value:'公開資料から確認可能な関連活動 →',position:'bottom',offset:12,fill:'#625b55',fontSize:11}} tick={{fontSize:10,fill:'#77716b'}} />
          <YAxis type="number" dataKey="y" domain={[0,100]} ticks={[0,25,50,75,100]} label={{value:'公約における政策の中心性 →',angle:-90,position:'insideLeft',offset:8,fill:'#625b55',fontSize:11}} tick={{fontSize:10,fill:'#77716b'}} />
          <Tooltip content={<MapTooltip />} />
          <Scatter data={data}>{data.map((item,i)=><Cell key={item.theme} fill={['#c56f2a','#8d7766','#6f7477','#b48a66'][i]} stroke="#fff" strokeWidth={3} />)}</Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="map-labels">{data.map(item=><span key={item.theme}><i style={{background:['#c56f2a','#8d7766','#6f7477','#b48a66'][data.indexOf(item)]}} />{item.theme}</span>)}</div>
    </div>
  );
}
