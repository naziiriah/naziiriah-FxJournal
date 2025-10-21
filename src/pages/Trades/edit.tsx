import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchTradeById,
  updateTrade,
} from "../../redux/resources/trade/tradeSlice";
import { motion } from "framer-motion";

const TradeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedTrade, loading, error } = useSelector(
    (state: RootState) => state.trade
  );

  const [formData, setFormData] = useState({
    symbol: "",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    profitLoss: "",
    strategy: "",
    session: "London",
    dailyBias: "",
    tradeDirection: "Buy",
    result: false,
    risk: "",
    reward: "",
    entryTimeframe: "",
    entryStructure: "",
    entrySetup: "",
    notes: "",
    error: false,
    errorReason: "",
    screenshotUrl: "",
  });

  // Fetch trade on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchTradeById(id))
        .unwrap()
        .then((data) => {
          setFormData({
            symbol: data.symbol || "",
            entryPrice: data.entryPrice?.toString() || "",
            exitPrice: data.exitPrice?.toString() || "",
            quantity: data.quantity?.toString() || "",
            profitLoss: data.profitLoss?.toString() || "",
            strategy: data.strategy || "",
            session: data.session || "London",
            dailyBias: data.dailyBias || "",
            tradeDirection: data.tradeDirection || "Buy",
            result: data.result ?? false,
            risk: data.risk || "",
            reward: data.reward || "",
            entryTimeframe: data.entryTimeframe || "",
            entryStructure: data.entryStructure || "",
            entrySetup: data.entrySetup || "",
            notes: data.notes || "",
            error: data.error ?? false,
            errorReason: data.errorReason || "",
            screenshotUrl: data.screenshotUrl || "",
          });
        });
    }
  }, [dispatch, id]);

  // handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // submit update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const updatedTrade = {
      ...formData,
      entryPrice: parseFloat(formData.entryPrice) || 0,
      exitPrice: parseFloat(formData.exitPrice) || 0,
      quantity: parseFloat(formData.quantity) || 0,
      profitLoss: parseFloat(formData.profitLoss) || 0,
    };

    dispatch(updateTrade({ id, data: updatedTrade }))
      .unwrap()
      .then(() => {
        alert("Trade updated successfully ✅");
        navigate("/trades");
      })
      .catch((err) => console.error("Error updating trade:", err));
  };

  if (loading && !selectedTrade)
    return <p className="p-6 text-gray-600">Loading trade...</p>;

  if (error)
    return <p className="p-6 text-red-600">Error loading trade: {error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Edit Trade
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Symbol */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Entry / Exit / Quantity */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Entry Price</label>
            <input
              type="number"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Exit Price</label>
            <input
              type="number"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Profit/Loss */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Profit/Loss</label>
            <input
              type="number"
              name="profitLoss"
              value={formData.profitLoss}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Trade Direction */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Direction</label>
            <select
              name="tradeDirection"
              value={formData.tradeDirection}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Session</label>
            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="London">London</option>
              <option value="New York">New York</option>
              <option value="Asia">Asia</option>
            </select>
          </div>

          {/* Strategy */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Strategy</label>
            <input
              type="text"
              name="strategy"
              value={formData.strategy}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Bias & Risk/Reward */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Daily Bias</label>
            <input
              type="text"
              name="dailyBias"
              value={formData.dailyBias}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Risk</label>
            <input
              type="text"
              name="risk"
              value={formData.risk}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Reward</label>
            <input
              type="text"
              name="reward"
              value={formData.reward}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Entry Details */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Entry Timeframe</label>
            <input
              type="text"
              name="entryTimeframe"
              value={formData.entryTimeframe}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Entry Structure</label>
            <input
              type="text"
              name="entryStructure"
              value={formData.entryStructure}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Entry Setup</label>
            <input
              type="text"
              name="entrySetup"
              value={formData.entrySetup}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Error Handling */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="error"
              checked={formData.error}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-700">Was there an error?</label>
          </div>

          {formData.error && (
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Error Reason
              </label>
              <textarea
                name="errorReason"
                value={formData.errorReason}
                onChange={handleChange}
                rows={2}
                className="w-full border rounded-lg p-2"
              />
            </div>
          )}

          {/* Screenshot */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Screenshot URL</label>
            <input
              type="text"
              name="screenshotUrl"
              value={formData.screenshotUrl}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="https://..."
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TradeEditPage;
