import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { AppDispatch, RootState } from "../../redux/store";
import { deleteTrade, fetchTrades } from "../../redux/resources/trade/tradeSlice";
import BottomNav from "../../components/BottomBar";


export default function TradeIndexPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { trades, loading, error } = useSelector((state: RootState) => state.trade);

  useEffect(() => {
    dispatch(fetchTrades());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trade?")) {

      await dispatch(deleteTrade({ id}));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Trades</h1>
        <button
          onClick={() => navigate("/trades/create")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <PlusIcon className="w-5 h-5" />
          New Trade
        </button>
      </div>

      {/* Status Messages */}
      {loading && <p className="text-gray-600">Loading trades...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && trades.length === 0 && !error && (
        <p className="text-gray-500">You haven’t recorded any trades yet.</p>
      )}

      {/* Table */}
      {!loading && trades.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Entry</th>
                <th className="py-3 px-4">Exit</th>
                <th className="py-3 px-4">P/L</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <motion.tr
                  key={trade.id}
                  whileHover={{ scale: 1.01 }}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{trade.symbol}</td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      trade.tradeDirection === "Buy"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trade.tradeDirection}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{trade.entryPrice}</td>
                  <td className="py-3 px-4 text-gray-700">{trade.exitPrice}</td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      trade.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {typeof trade.profitLoss === "number"
                        ? trade.profitLoss.toFixed(2)
                        : "0.00"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        trade.result === "Profit"
                          ? "bg-green-100 text-green-700"
                          : trade.result === "Break Even" 
                          ? "bg-yellow-100 text-yellow-700"
                          : trade.result === "Pending"
                          ?"bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {trade.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(trade.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => navigate(`/trades/${trade.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/trades/edit/${trade.id}`)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(trade.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
