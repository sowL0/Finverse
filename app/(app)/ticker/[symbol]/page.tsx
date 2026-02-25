import TickerDetailPage from '@/components/finverse/ticker-detail';

interface Props {
  params: { symbol: string };
}

export default function TickerRoute({ params }: Props) {
  return <TickerDetailPage symbol={params.symbol.toUpperCase()} />;
}
