import './globals.css';

export const metadata = {
  title: 'RMPM｜その公約、前の選挙から何があった？',
  description: '公約と公開資料から確認可能な活動との関係を整理する、架空の政治情報可視化デモ。',
  openGraph: {
    title: 'RMPM｜その公約、前の選挙から何があった？',
    description: '公約と公開資料をつなぐ、市民のための検証ツール。',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RMPM｜その公約、前の選挙から何があった？',
    description: '公約と公開資料をつなぐ、市民のための検証ツール。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }) {
  return <html lang="ja"><body>{children}</body></html>;
}
