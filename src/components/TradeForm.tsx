import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch } from "../redux/store";
import {
  createTrade,
  updateTrade,
  fetchTradeById,
} from "../redux/resources/trade/tradeSlice";

// --- Type for local form state ---
interface TradeFormState {
  symbol: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  profitLoss: string;
  strategy: string;
  session: string;
  dailyBias: string;
  tradeDirection: string;
  result: string;
  risk: string;
  reward: string;
  entryTimeframe: string;
  entryStructure: string;
  entrySetup: string;
  notes: string;
  error: boolean;
  errorReason: string;
}

interface TradeFormProps {
  isEdit?: boolean;
}

const TradeForm: React.FC<TradeFormProps> = ({ isEdit = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<TradeFormState>({
    symbol: "",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    profitLoss: "",
    strategy: "",
    session: "London",
    dailyBias: "",
    tradeDirection: "Buy",
    result: "",
    risk: "",
    reward: "",
    entryTimeframe: "",
    entryStructure: "",
    entrySetup: "",
    notes: "",
    error: false,
    errorReason: "",
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);

  // ✅ Load existing trade data if editing
  useEffect(() => {
    if (isEdit && id) {
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
            result: "",
            risk: data.risk || "",
            reward: data.reward || "",
            entryTimeframe: data.entryTimeframe || "",
            entryStructure: data.entryStructure || "",
            entrySetup: data.entrySetup || "",
            notes: data.notes || "",
            error: data.error ?? false,
            errorReason: data.errorReason || "",
          });
        })
        .catch(() => {});
    }
  }, [dispatch, id, isEdit]);

  const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
        ) => {
        const { name, value, type } = e.target;

        // Safe narrowing
        const newValue =
            type === "checkbox" && "checked" in e.target
            ? (e.target as HTMLInputElement).checked
            : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };


  // ✅ Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  // ✅ Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (screenshot) {
      data.append("file", screenshot);
    }

    if (isEdit && id) {
      dispatch(updateTrade({ id, data }))
        .unwrap()
        .then(() => navigate("/trades"));
    } else {
      dispatch(createTrade(data))
        .unwrap()
        .then(() => navigate("/trades"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Trade" : "Create New Trade"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symbol */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Entry & Exit Prices */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Entry Price</label>
          <input
            type="number"
            name="entryPrice"
            value={formData.entryPrice}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Exit Price</label>
          <input
            type="number"
            name="exitPrice"
            value={formData.exitPrice}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Quantity & Direction */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Trade Direction</label>
          <select
            name="tradeDirection"
            value={formData.tradeDirection}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>

        {/* Session */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Session</label>
          <select
            name="session"
            value={formData.session}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Asia">Asia</option>
          </select>
        </div>

        {/* Screenshot */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm mb-1">Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="md:col-span-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {isEdit ? "Update Trade" : "Create Trade"}
        </button>
      </form>
    </div>
  );
};

export default TradeForm;
