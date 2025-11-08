import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import {
  fetchReviews,
  deleteReview,
} from "../../redux/resources/review/reviewSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  StarIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import BottomNav from "../../components/BottomBar";

const ReviewIndexPage= () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: reviews, loading, error } = useSelector(
    (state: RootState) => state.review
  );

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await dispatch(deleteReview(id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Reviews</h1>
        <Link
          to="/reviews/create"
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <PlusCircleIcon className="h-5 w-5 mr-1" />
          Create Review
        </Link>
      </div>

      {/* Loading / Error / Empty */}
      {loading && <p className="text-gray-600">Loading reviews...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && reviews.length === 0 && !error && (
        <p className="text-gray-500">You haven’t written any reviews yet.</p>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-800 font-medium text-lg mb-1">
                  {review.review}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < (review.rating ?? 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {review.rating ?? "No rating"}
                  </span>
                </div>

                {/* Error Check */}
                <p
                  className={`text-sm font-medium ${
                    review.errorCheck
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {review.errorCheck ? "❌ Errors Found" : "✅ No Errors"}
                </p>

                {/* Error Descriptions */}
                {review.errorDescriptions &&
                  review.errorDescriptions.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                      {review.errorDescriptions.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}

                {/* Created At */}
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/reviews/edit/${review.id}`}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default ReviewIndexPage;
