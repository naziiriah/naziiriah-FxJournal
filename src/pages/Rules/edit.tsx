import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateRule } from "../../redux/resources/rule/ruleSlice";
import type { AppDispatch, RootState } from "../../redux/store";

export default function RulesEditPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { rules } = useSelector((state: RootState) => state.rule);
  const ruleToEdit = rules.find((r) => r.id === id);

  const [title, setTitle] = useState(ruleToEdit?.title || "");
  const [expression, setExpression] = useState(ruleToEdit?.expression || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ruleToEdit) {
      navigate("/rules"); // redirect if rule not found
    }
  }, [ruleToEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateRule({ id: id!, data: { title, expression } })).unwrap();
      navigate("/rules"); // redirect to rules index
    } catch (err: any) {
      setError(err || "Failed to update rule.");
    } finally {
      setLoading(false);
    }
  };

  if (!ruleToEdit) return null; // fallback

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Rule</h1>

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
            {loading ? "Please wait…" : "Update Rule"}
          </button>
        </form>
      </div>
    </div>
  );
}
