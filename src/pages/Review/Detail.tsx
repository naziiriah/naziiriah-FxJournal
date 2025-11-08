// src/pages/Reviews/ReviewDetailsPage.tsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { fetchReviewById } from "../../redux/resources/review/reviewSlice";
;

const ReviewDetailsPage= () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedReview, loading } = useSelector((state: RootState) => state.review);

  useEffect(() => {
    if (id) dispatch(fetchReviewById(id));
  }, [id, dispatch]);

  if (loading || !selectedReview) return <div>Loading...</div>;

  const { review, errorCheck, errorDescriptions, rating, createdAt, } = selectedReview;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Review Details</h1>

      <div className="space-y-3">
        <div>
          <span className="font-semibold">Review:</span>
          <p className="mt-1 text-gray-700">{review}</p>
        </div>

        <div>
          <span className="font-semibold">Error Check:</span>{" "}
          <span
            className={`${
              errorCheck ? "text-red-600" : "text-green-600"
            } font-medium`}
          >
            {errorCheck ? "Errors Found" : "No Errors"}
          </span>
        </div>

        {errorCheck && errorDescriptions?.length > 0 && (
          <div>
            <span className="font-semibold">Error Descriptions:</span>
            <ul className="list-disc ml-6 text-gray-700">
              {errorDescriptions.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <span className="font-semibold">Rating:</span>{" "}
          <span className="text-yellow-500 font-bold">{rating} / 5</span>
        </div>

        <div>
          <span className="font-semibold">Created At:</span>{" "}
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>

       
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to={`/reviews/edit/${id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Edit
        </Link>
        <Link
          to="/reviews"
          className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default ReviewDetailsPage;
