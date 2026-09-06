export const themes = ['子育て', '交通', '医療', 'デジタル行政'];

const source = (type, title, date, excerpt) => ({ type, title, date, excerpt });

export const candidates = [
  {
    id: 'tanaka', name: '田中 未来', kana: 'たなか みらい', role: '現職・2期', age: 48,
    tagline: '暮らしの選択肢を、次の世代へ。', color: '#416f8f',
    policies: [
      { theme:'子育て', status:'修正', previous:'保育料を段階的に無償化', positioning:'前回公約の重点政策', current:'所得制限を設けた保育料無償化', explanation:'財政状況と国制度の変更を踏まえ、支援を必要とする世帯から対象を広げる設計に修正しました。', centrality:88, activityLevel:72,
        activities:[{year:'2023',text:'市議会で保育料負担と待機児童について答弁'},{year:'2024',text:'第2子保育料軽減を含む関連予算案を提出'}],
        sources:[source('過去選挙公報','2022年 福岡未来市長選挙公報','2022.10.02','子育て世帯の負担を減らすため、保育料の段階的な無償化を進めます。'),source('市議会会議録','令和5年第3回定例会 会議録','2023.09.14','保育料負担の軽減と受け皿整備を一体的に検討する旨を答弁。'),source('予算資料','令和6年度 子育て支援関連予算','2024.02.20','第2子保育料軽減事業 2億1,000万円を計上。')] },
      { theme:'交通', status:'継続', previous:'東西循環バスを3路線新設', positioning:'地域別政策の一つ', current:'東西循環バスの実証運行を2路線へ拡大', explanation:'利用実績を確認しながら、運転手不足に対応できる路線設計で段階的に進めます。', centrality:64, activityLevel:58, activities:[{year:'2023',text:'地域公共交通計画の改定案を公表'},{year:'2025',text:'1路線で実証運行を開始'}], sources:[source('過去選挙公報','2022年 福岡未来市長選挙公報','2022.10.02','東西地域をつなぐ循環バス3路線の新設を目指します。'),source('予算資料','地域交通実証事業 概要','2025.03.01','東部地区で6か月間の循環バス実証運行を行う。')] },
      { theme:'医療', status:'実施済み', previous:'休日夜間診療の予約情報をオンライン化', positioning:'生活基盤政策', current:'オンライン案内の対象医療機関を拡大', explanation:'予約情報の公開を開始したため、次は参加医療機関と掲載情報の拡充に移ります。', centrality:55, activityLevel:82, activities:[{year:'2023',text:'医師会との共同検討会を設置'},{year:'2024',text:'休日夜間診療案内サイトを公開'}], sources:[source('市議会会議録','福祉保健委員会 会議録','2023.06.09','休日夜間診療の案内方法について、市医師会と協議を開始。'),source('予算資料','医療情報デジタル化事業','2024.01.28','休日夜間の診療状況を案内するシステム整備費を計上。')] },
      { theme:'デジタル行政', status:'優先順位変更', previous:'全行政手続の80%をオンライン化', positioning:'最重点政策', current:'利用頻度の高い30手続きを優先してオンライン化', explanation:'候補者からの回答はありません', centrality:76, activityLevel:48, activities:[{year:'2023',text:'オンライン申請基盤の調達仕様を公開'},{year:'2025',text:'12手続でオンライン受付を開始'}], sources:[source('質問主意書','行政手続オンライン化に関する回答書','2025.04.18','対象候補82手続のうち、利用頻度等を踏まえ12手続で受付を開始。')] },
    ],
  },
  {
    id:'yamamoto', name:'山本 健司', kana:'やまもと けんじ', role:'市議・1期', age:55, tagline:'まちをつなぎ、暮らしを支える。', color:'#696687',
    policies:[
      {theme:'子育て',status:'継続',previous:'放課後児童クラブの待機を減らす',positioning:'重点政策',current:'小学校施設を活用し受入枠を600人拡大',explanation:'現場の運営人材確保を前提に、学校施設の活用を具体化しました。',centrality:78,activityLevel:66,activities:[{year:'2023',text:'児童クラブの待機状況について一般質問'},{year:'2025',text:'学校施設活用の条例改正案に賛成'}],sources:[source('市議会会議録','令和5年第2回定例会 会議録','2023.06.21','児童クラブの地区別待機状況と学校施設活用について質問。'),source('質問主意書','放課後児童クラブに関する質問主意書','2024.11.08','支援員確保と余裕教室の利用可能性を質問。')]},
      {theme:'交通',status:'統合',previous:'高齢者向けバス券の年間交付',positioning:'最重点政策',current:'バス券と予約型乗合交通を選べる移動支援制度',explanation:'路線バスが少ない地域でも使える制度にするため、二つの手段を一つの支援枠にまとめました。',centrality:90,activityLevel:74,activities:[{year:'2023',text:'高齢者移動実態調査の実施を提案'},{year:'2024',text:'予約型乗合交通の実証予算に賛成'}],sources:[source('過去選挙公報','2022年 市議会議員選挙公報','2022.04.10','高齢者が外出を続けられる年間バス券制度を提案します。'),source('予算資料','予約型乗合交通 実証事業','2024.02.15','郊外2地区で電話・アプリ予約型交通を実証。')]},
      {theme:'医療',status:'取り下げ',previous:'市立診療所を北部地区に新設',positioning:'地域別重点政策',current:'既存医療機関への巡回診療支援',explanation:'医療従事者の確保が難しいとの調査結果を受け、既存施設を活かす方式へ変更しました。',centrality:61,activityLevel:43,activities:[{year:'2023',text:'北部地区の医療アクセスについて質問'},{year:'2024',text:'医療人材確保調査の結果説明を受領'}],sources:[source('市議会会議録','地域医療特別委員会 会議録','2024.07.05','常設診療所に必要な人材確保の見通しについて質疑。')]},
      {theme:'デジタル行政',status:'継続',previous:'窓口の待ち時間をオンラインで見える化',positioning:'改善提案',current:'混雑状況と手続所要時間のリアルタイム表示',explanation:'候補者からの回答はありません',centrality:52,activityLevel:36,activities:[{year:'2024',text:'窓口混雑データの公開可否を質問'}],sources:[source('質問主意書','窓口混雑情報に関する質問主意書','2024.05.17','庁舎窓口の待ち時間データの取得・公開状況を質問。')]},
    ],
  },
  {
    id:'sato', name:'佐藤 葵', kana:'さとう あおい', role:'新人', age:39, tagline:'対話から、暮らしの仕組みをつくる。', color:'#547079', firstTime:true,
    policies:[
      {theme:'子育て',status:null,previous:null,positioning:null,current:'子育て相談を一か所で受け付ける伴走窓口を設置',explanation:'今回が初回立候補のため、過去公約との比較対象なし',centrality:84,activityLevel:null,activities:[],sources:[source('今回選挙公報','2026年 福岡未来市長選挙公報','2026.09.01','妊娠期から学齢期まで、相談先に迷わない伴走窓口を設置します。')]},
      {theme:'交通',status:null,previous:null,positioning:null,current:'地域住民とつくる小規模オンデマンド交通',explanation:'今回が初回立候補のため、過去公約との比較対象なし',centrality:72,activityLevel:null,activities:[],sources:[source('今回選挙公報','2026年 福岡未来市長選挙公報','2026.09.01','地域ごとの移動需要を住民と調べ、小規模な予約型交通を設計します。')]},
      {theme:'医療',status:null,previous:null,positioning:null,current:'若年層のこころの相談窓口を夜間まで開設',explanation:'今回が初回立候補のため、過去公約との比較対象なし',centrality:68,activityLevel:null,activities:[],sources:[source('今回選挙公報','2026年 福岡未来市長選挙公報','2026.09.01','若年層が仕事や学校の後にも相談できる時間帯を設けます。')]},
      {theme:'デジタル行政',status:null,previous:null,positioning:null,current:'申請前に必要書類が分かる手続ナビを公開',explanation:'今回が初回立候補のため、過去公約との比較対象なし',centrality:60,activityLevel:null,activities:[],sources:[source('今回選挙公報','2026年 福岡未来市長選挙公報','2026.09.01','質問に答えると必要書類と窓口が分かる手続ナビを公開します。')]},
    ],
  },
];

export const methodology = [
  ['採点しない','RMPMは達成率や順位をつくるシステムではありません。'],
  ['AIは評価しない','AIは公開資料から関連する可能性のある情報を探す補助にのみ使います。'],
  ['一次資料へ戻れる','表示する活動には、確認に使った架空の一次資料を紐づけています。'],
  ['見えない活動もある','非公開の調整や資料に表れない活動が存在することを前提にします。'],
  ['変更を否定しない','状況に応じた政策変更そのものを、良い・悪いとは判定しません。'],
  ['理由を検証できる','続けた理由、変えた理由を候補者が説明できる場をつくります。'],
];
