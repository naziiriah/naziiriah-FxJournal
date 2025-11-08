import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateReview, fetchReviewById } from "../../redux/resources/review/reviewSlice";
import { type AppDispatch, type RootState } from "../../redux/store";

export default function ReviewEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedReview, loading } = useSelector((state: RootState) => state.review);

  const [review, setReview] = useState("");
  const [errorCheck, setErrorCheck] = useState(false);
  const [errorDescriptions, setErrorDescriptions] = useState<string[]>([]);
  const [newError, setNewError] = useState("");
  const [rating, setRating] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchReviewById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedReview) {
      setReview(selectedReview.review || "");
      setErrorCheck(selectedReview.errorCheck || false);
      setErrorDescriptions(selectedReview.errorDescriptions || []);
      setRating(selectedReview.rating || 1);
    }
  }, [selectedReview]);

  const handleAddError = () => {
    if (newError.trim()) {
      setErrorDescriptions((prev) => [...prev, newError.trim()]);
      setNewError("");
    }
  };

  const handleRemoveError = (index: number) => {
    setErrorDescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);

    try {
      const updatedReview = {
        id,
        review,
        errorCheck,
        errorDescriptions,
        rating,
      };

      await dispatch(updateReview(updatedReview)).unwrap();
      navigate("/reviews");
    } catch (err) {
      console.error("❌ Failed to update review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Review</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />
        </div>

        {/* Error Check */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="errorCheck"
            checked={errorCheck}
            onChange={(e) => setErrorCheck(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="errorCheck" className="text-sm text-gray-700">
            Error Found in Review
          </label>
        </div>

        {/* Error Descriptions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Descriptions
          </label>
          {errorDescriptions.length > 0 ? (
            <ul className="space-y-2">
              {errorDescriptions.map((desc, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-gray-700">{desc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveError(index)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No error descriptions added.</p>
          )}

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newError}
              onChange={(e) => setNewError(e.target.value)}
              placeholder="Add new error description"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddError}
              className="bg-indigo-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 && "s"}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded-lg text-white font-medium transition-all ${
            submitting
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
