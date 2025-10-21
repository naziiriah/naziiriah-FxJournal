import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBias } from "../../redux/resources/bias/biasSlice";
import type { RootState, AppDispatch } from "../../redux/store";

export default function CreateBiasPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.bias);

  const [form, setForm] = useState({
    title: "",
    currencyPair: "",
    description: "",
    beforeImageUrl: null as File | null,
    afterImageUrl: null as File | null,
  });

  const [previewBefore, setPreviewBefore] = useState<string | null>(null);
  const [previewAfter, setPreviewAfter] = useState<string | null>(null);

  // Handle text inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle image inputs
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (type === "before") setForm({ ...form, beforeImageUrl: file });
    else setForm({ ...form, afterImageUrl: file });

    const previewUrl = URL.createObjectURL(file);
    if (type === "before") setPreviewBefore(previewUrl);
    else setPreviewAfter(previewUrl);
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.currencyPair) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("currencyPair", form.currencyPair);
    formData.append("description", form.description);

    if (form.beforeImageUrl) formData.append("files", form.beforeImageUrl);
    if (form.afterImageUrl) formData.append("files", form.afterImageUrl);

    // Dispatch the Redux async thunk
    const result = await dispatch(createBias(formData));

    if (createBias.fulfilled.match(result)) {
      alert("Bias created successfully ✅");
      navigate("/bias");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Create New Bias</h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Currency Pair */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Currency Pair *</label>
            <input
              type="text"
              name="currencyPair"
              value={form.currencyPair}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Before Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Before Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "before")}
              disabled={loading}
            />
            {previewBefore && (
              <img
                src={previewBefore}
                alt="Before"
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* After Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">After Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "after")}
              disabled={loading}
            />
            {previewAfter && (
              <img
                src={previewAfter}
                alt="After"
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white shadow transition-all ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Creating..." : "Create Bias"}
          </button>
        </form>

        <button
          onClick={() => navigate("/bias")}
          className="mt-4 text-sm text-gray-600 hover:text-indigo-600"
        >
          ← Back to Bias List
        </button>
      </div>
    </div>
  );
}
