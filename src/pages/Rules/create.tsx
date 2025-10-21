import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../redux/store";
import { createRule } from "../../redux/resources/rule/ruleSlice";

export default function RulesCreatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [expression, setExpression] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    try {

      await dispatch(createRule({ data: {
          title, expression,
      } })).unwrap();
      navigate("/rules"); // redirect to rules index
    } catch (err: any) {
      setError(err || "Failed to create rule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Rule</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter rule title"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Expression</label>
            <textarea
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional expression"
              rows={4}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white shadow transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Please wait…" : "Create Rule"}
          </button>
        </form>
      </div>
    </div>
  );
}
