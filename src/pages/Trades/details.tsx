import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PencilIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { AppDispatch, RootState } from "../../redux/store";
import { deleteTrade, fetchTradeById } from "../../redux/resources/trade/tradeSlice";


export default function TradeDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { selectedTrade: trade, loading, error } = useSelector(
    (state: RootState) => state.trade
  );

  useEffect(() => {
    if (id) dispatch(fetchTradeById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this trade?")) {
    
      await dispatch(deleteTrade({ id: id!}));
      navigate("/trades");
    }
  };

  if (loading) return <p className="text-gray-600 p-6">Loading trade details...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;
  if (!trade) return <p className="text-gray-500 p-6">Trade not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/trades")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/trades/edit/${trade.id}`)}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
          >
            <PencilIcon className="w-5 h-5" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700"
          >
            <TrashIcon className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>

      {/* Trade Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
      >
        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {trade.symbol} —{" "}
            <span
              className={`${
                trade.tradeDirection === "Buy" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trade.tradeDirection}
            </span>
          </h2>

          <p
            className={`text-sm font-semibold ${
              trade.result ? "text-green-600" : "text-red-600"
            }`}
          >
            {trade.result ? "Win ✅" : "Loss ❌"}
          </p>
        </div>

        {/* Prices and P/L */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Entry Price</p>
            <p className="font-medium text-gray-800">{trade.entryPrice}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Exit Price</p>
            <p className="font-medium text-gray-800">{trade.exitPrice}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Profit/Loss</p>
            <p
              className={`font-semibold ${
                trade.profitLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trade.profitLoss}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Quantity</p>
            <p className="font-medium text-gray-800">{trade.quantity}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Session</p>
            <p className="font-medium text-gray-800">{trade.session || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Daily Bias</p>
            <p className="font-medium text-gray-800">{trade.dailyBias || "—"}</p>
          </div>
        </div>

        {/* Strategy / Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-600 font-medium mb-1">Strategy</h3>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
              {trade.strategy || "—"}
            </p>
          </div>

          <div>
            <h3 className="text-gray-600 font-medium mb-1">Notes</h3>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
              {trade.notes || "—"}
            </p>
          </div>
        </div>

        {/* Risk & Reward */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-600 font-medium mb-1">Risk</h3>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
              {trade.risk || "—"}
            </p>
          </div>
          <div>
            <h3 className="text-gray-600 font-medium mb-1">Reward</h3>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
              {trade.reward || "—"}
            </p>
          </div>
        </div>

        {/* Screenshot */}
        {trade.screenshotUrl && (
          <div>
            <h3 className="text-gray-600 font-medium mb-2">Screenshot</h3>
            <img
              src={"http://localhost:3000"+trade.screenshotUrl}
              alt="Trade Screenshot"
              className="w-full rounded-lg border shadow-sm"
            />
          </div>
        )}

        {/* Created At */}
        <p className="text-sm text-gray-400 text-right">
          Created on: {new Date(trade.createdAt).toLocaleString()}
        </p>
      </motion.div>
    </div>
  );
}
