import React, { useEffect, useMemo, type JSX } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchTrades } from '../../redux/resources/trade/tradeSlice';
import { useAuthRedirect } from '../../hooks/UseAuth';
import BottomNav from '../../components/BottomBar';
import { useNavigate } from 'react-router-dom';

const TradingJournalHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useAuthRedirect();

  // Redux selectors
  const {  trades, loading } = useSelector((state: RootState) => state.trade);

  // Fetch trades on mount
  useEffect(() => {
    dispatch(fetchTrades());
  }, [dispatch]);

  // Compute stats
  const stats = useMemo(() => computeStats(trades), [trades]);
  const chartData = useMemo(() => chartDataFromTrades(trades), [trades]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">TJ</div>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold">Trading Journal</h1>
            <p className="text-sm text-gray-500">Track, analyze and improve your trading.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/trades/create')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700"
          >
            + Add Trade
          </button>
          <div className="text-sm text-gray-600">Account: <span className="font-medium">Main</span></div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center: Charts and Recent Trades */}
        <section className="lg:col-span-2 space-y-6">
          {/* Monthly P&L */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Monthly P&L</h2>
                <p className="text-sm text-gray-500">Snapshot of realized profit & loss this month</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Net P&L</div>
                <div className={`text-xl font-bold ${stats.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.netPnl)}
                </div>
              </div>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pnl" stroke="#6366F1" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Trades Table */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
            {loading ? (
              <p className="text-gray-500">Loading trades...</p>
            ) : trades.length === 0 ? (
              <p className="text-gray-500">No trades available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-500">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Entry</th>
                      <th className="pb-2">Exit</th>
                      <th className="pb-2">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.slice(0, 8).map((t: { id: React.Key | null | undefined; createdAt: string | number | Date; symbol: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; tradeDirection: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; entryPrice: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; exitPrice: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; profitLoss: number; }) => (
                      <tr key={t.id} className="border-t">
                        <td className="py-3 text-sm text-gray-600">{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 font-medium">{t.symbol}</td>
                        <td className="py-3 text-sm">{t.tradeDirection}</td>
                        <td className="py-3 text-sm">{t.entryPrice}</td>
                        <td className="py-3 text-sm">{t.exitPrice}</td>
                        <td className={`py-3 font-medium ${t.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(t.profitLoss)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-4 shadow">
            <h4 className="text-sm text-gray-500">Quick Stats</h4>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <StatCard label="Net P&L" value={formatCurrency(stats.netPnl)} />
              <StatCard label="Win Rate" value={`${stats.winRate}%`} />
              <StatCard label="Avg R" value={`${stats.avgR.toFixed(2)}R`} />
              <StatCard label="Total Trades" value={stats.totalTrades.toString()} />
            </div>
          </div>
        </aside>
      </main>

      <BottomNav />
    </div>
  );
}

// --------------------
// Helper Components & Functions
// --------------------
function StatCard({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div className="rounded-xl p-3 bg-gray-50">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

function pnlForTrade(t: any): number {
  const raw = (t.exitPrice - t.entryPrice) * t.quantity * (t.tradeDirection === 'Buy' ? 1 : -1);
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

function computeStats(trades: any[]) {
  const totalTrades = trades.length;
  let wins = 0;
  let netPnl = 0;
  let totalR = 0;

  for (const t of trades) {
    const p = t.profitLoss ?? pnlForTrade(t);
    netPnl += p;
    if (p > 0) wins++;
    const r = t.entryPrice ? p / Math.abs(t.entryPrice) : 0;
    totalR += r;
  }

  return {
    totalTrades,
    winRate: totalTrades ? Math.round((wins / totalTrades) * 100) : 0,
    netPnl: Math.round((netPnl + Number.EPSILON) * 100) / 100,
    avgR: totalTrades ? totalR / totalTrades : 0,
  };
}

function chartDataFromTrades(trades: any[]): { month: string; pnl: number }[] {
  const map = new Map<string, number>();
  for (const t of trades) {
    const month = new Date(t.createdAt).toISOString().slice(0, 7);
    map.set(month, (map.get(month) || 0) + (t.profitLoss ?? pnlForTrade(t)));
  }
  const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  return entries.map(([month, pnl]) => ({ month, pnl }));
}

function formatCurrency(num: number): string {
  const sign = num < 0 ? '-' : '';
  return `${sign}$${Math.abs(num).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}


export default TradingJournalHome