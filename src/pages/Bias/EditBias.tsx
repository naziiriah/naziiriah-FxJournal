import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { type RootState, type AppDispatch } from "../../redux/store";
import { updateBias, fetchBiases } from "../../redux/resources/bias/biasSlice";

export default function EditBiasPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state: RootState) => state.bias);

  const biasToEdit = items.find((b) => b.id === id);

  const [form, setForm] = useState({
    title: "",
    currencyPair: "",
    description: "",
    beforeImage: null as File | null,
    afterImage: null as File | null,
  });
  const [previewBefore, setPreviewBefore] = useState<string | null>(null);
  const [previewAfter, setPreviewAfter] = useState<string | null>(null);

  useEffect(() => {
    if (!biasToEdit) {
      dispatch(fetchBiases());
    } else {
      setForm({
        title: biasToEdit.title,
        currencyPair: biasToEdit.currencyPair,
        description: biasToEdit.description || "",
        beforeImage: null,
        afterImage: null,
      });
      setPreviewBefore(biasToEdit.beforeImageUrl || null);
      setPreviewAfter(biasToEdit.afterImageUrl || null);
    }
  }, [biasToEdit, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setForm({ ...form, [`${type}Image`]: file });
      const previewUrl = URL.createObjectURL(file);
      type === "before" ? setPreviewBefore(previewUrl) : setPreviewAfter(previewUrl);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!biasToEdit) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("currencyPair", form.currencyPair);
    formData.append("description", form.description);
    if (form.beforeImage) formData.append("beforeImageUrl", form.beforeImage);
    if (form.afterImage) formData.append("afterImageUrl", form.afterImage);

    const token = localStorage.getItem("token") || "";
    const result = await dispatch(updateBias({ id: biasToEdit.id, formData, token }));

    if (updateBias.fulfilled.match(result)) {
      alert("Bias updated successfully ✅");
      navigate("/bias");
    }
  };

  if (!biasToEdit) return <p className="text-gray-500">Loading bias...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Edit Bias</h1>

        {error && <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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

          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              rows={3}
              disabled={loading}
            />
          </div>

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
                alt="Before Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

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
                alt="After Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white shadow transition-all ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Updating..." : "Update Bias"}
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
