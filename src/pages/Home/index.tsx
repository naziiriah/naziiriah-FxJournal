import React, { useState, useMemo, type FormEvent, type JSX } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { FormState, Stats, StatCardProps, HomeTrade } from '../../interface';
import { useAuthRedirect } from '../../hooks/UseAuth';
import BottomNav from '../../components/BottomBar';
import { useNavigate } from 'react-router-dom';



export default function TradingJournalHome(): JSX.Element {
  const [trades, setTrades] = useState<HomeTrade[]>(sampleTrades);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({ symbol: '', type: 'Long', entry: '', exit: '', size: '' });
  useAuthRedirect();
  const stats = useMemo<Stats>(() => computeStats(trades), [trades]);
  const navigate = useNavigate();

  function addTrade(e: FormEvent) {
    e.preventDefault();
    const newTrade: HomeTrade = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      symbol: form.symbol || 'N/A',
      type: form.type,
      entry: parseFloat(form.entry) || 0,
      exit: parseFloat(form.exit) || 0,
      size: parseFloat(form.size) || 0,
    };
    setTrades([newTrade, ...trades]);
    setForm({ symbol: '', type: 'Long', entry: '', exit: '', size: '' });
    setShowAdd(false);
  }

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
        <section className="lg:col-span-2 space-y-6">
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
                <div className={`text-xl font-bold ${stats.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(stats.netPnl)}</div>
              </div>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDataFromTrades(trades)}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pnl" stroke="#6366F1" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
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
                  {trades.slice(0, 8).map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-3 text-sm text-gray-600">{t.date}</td>
                      <td className="py-3 font-medium">{t.symbol}</td>
                      <td className="py-3 text-sm">{t.type}</td>
                      <td className="py-3 text-sm">{t.entry}</td>
                      <td className="py-3 text-sm">{t.exit}</td>
                      <td className={`py-3 font-medium ${pnlForTrade(t) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(pnlForTrade(t))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

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

          <div className="rounded-2xl bg-white p-4 shadow">
            <h4 className="text-sm text-gray-500">Filters</h4>
            <div className="mt-3 space-y-2">
              <select className="w-full rounded-lg border p-2 text-sm">
                <option>All accounts</option>
                <option>Main</option>
                <option>Demo</option>
              </select>
              <input className="w-full rounded-lg border p-2 text-sm" placeholder="Search symbol or note" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Tip</h4>
            <p>Write a brief note after each trade — your future self will thank you.</p>
          </div>
        </aside>
      </main>

      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <motion.form
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            onSubmit={addTrade}
            className="relative bg-white rounded-2xl p-6 shadow-xl w-full max-w-md z-50"
          >
            <h3 className="text-lg font-semibold mb-4">Add Trade</h3>
            <div className="space-y-3">
              <input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Symbol (e.g. AAPL)" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'Long' | 'Short' })} className="w-full border rounded-lg p-2">
                <option>Long</option>
                <option>Short</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Entry" />
                <input value={form.exit} onChange={(e) => setForm({ ...form, exit: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Exit" />
              </div>
              <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Size (shares/contracts)" />
              <div className="flex items-center justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Add trade</button>
              </div>
            </div>
          </motion.form>
        </div>
      )}
      <BottomNav />
    </div>
  );
}



function StatCard({ label, value }: StatCardProps): JSX.Element {
  return (
    <div className="rounded-xl p-3 bg-gray-50">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

const sampleTrades: HomeTrade[] = [
  { id: 1, date: '2025-10-18', symbol: 'AAPL', type: 'Long', entry: 170.5, exit: 175.2, size: 10 },
  { id: 2, date: '2025-10-10', symbol: 'EURUSD', type: 'Short', entry: 1.075, exit: 1.069, size: 10000 },
  { id: 3, date: '2025-09-29', symbol: 'TSLA', type: 'Long', entry: 210.0, exit: 195.0, size: 5 },
  { id: 4, date: '2025-09-02', symbol: 'BTCUSD', type: 'Long', entry: 48000, exit: 53000, size: 0.05 },
  { id: 5, date: '2025-08-21', symbol: 'GOOG', type: 'Long', entry: 125.3, exit: 128.1, size: 4 },
];

function pnlForTrade(t: HomeTrade): number {
  const raw = (t.exit - t.entry) * t.size * (t.type === 'Long' ? 1 : -1);
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

function computeStats(trades: HomeTrade[]): Stats {
  const totalTrades = trades.length;
  let wins = 0;
  let netPnl = 0;
  let totalR = 0;

  for (const t of trades) {
    const p = pnlForTrade(t);
    netPnl += p;
    if (p > 0) wins++;
    const r = t.entry ? p / Math.abs(t.entry) : 0;
    totalR += r;
  }

  return {
    totalTrades,
    winRate: totalTrades ? Math.round((wins / totalTrades) * 100) : 0,
    netPnl: Math.round((netPnl + Number.EPSILON) * 100) / 100,
    avgR: totalTrades ? totalR / totalTrades : 0,
  };
}

function chartDataFromTrades(trades: HomeTrade[]): { month: string; pnl: number }[] {
  const map = new Map<string, number>();
  for (const t of trades) {
    const month = t.date.slice(0, 7);
    map.set(month, (map.get(month) || 0) + pnlForTrade(t));
  }
  const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  return entries.map(([month, pnl]) => ({ month, pnl }));
}

function formatCurrency(num: number): string {
  const sign = num < 0 ? '-' : '';
  return `${sign}$${Math.abs(num).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}