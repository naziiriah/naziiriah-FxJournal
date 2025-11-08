import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../../redux/resources/review/reviewSlice";
import { type AppDispatch, type RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const ReviewCreatePage=() => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.review);

  const [form, setForm] = useState({
    review: "",
    errorCheck: false,
    errorDescriptions: [""],
    rating: 3,
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle adding/removing error descriptions
  const handleErrorDescriptionChange = (index: number, value: string) => {
    const updated = [...form.errorDescriptions];
    updated[index] = value;
    setForm({ ...form, errorDescriptions: updated });
  };

  const addErrorDescription = () => {
    setForm({ ...form, errorDescriptions: [...form.errorDescriptions, ""] });
  };

  const removeErrorDescription = (index: number) => {
    const updated = form.errorDescriptions.filter((_, i) => i !== index);
    setForm({ ...form, errorDescriptions: updated });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createReview(form)).unwrap();
      navigate("/reviews");
    } catch (err) {
      console.error("Failed to create review:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Review</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Review Text */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Review</label>
            <textarea
              name="review"
              value={form.review}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-200 focus:outline-none"
              rows={4}
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rating (1–5)</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={form.rating}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Error Check */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="errorCheck"
              checked={form.errorCheck}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-gray-700">Was there an error?</label>
          </div>

          {/* Error Descriptions */}
          {form.errorCheck && (
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium">Error Descriptions</label>
              {form.errorDescriptions.map((desc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => handleErrorDescriptionChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    placeholder={`Error ${index + 1}`}
                  />
                  {form.errorDescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeErrorDescription(index)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addErrorDescription}
                className="text-blue-600 font-medium hover:underline"
              >
                + Add another error description
              </button>
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewCreatePage