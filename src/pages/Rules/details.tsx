import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchRuleByID,
  deleteRule,
} from "../../redux/resources/rule/ruleSlice";
import { PencilIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const RuleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedRule, loading, error } = useSelector(
    (state: RootState) => state.rule
  );

  // Fetch rule when page loads
  useEffect(() => {
    if (id) dispatch(fetchRuleByID({id}));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      await dispatch(deleteRule({ id: id!}));
      navigate("/rules");
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading rule...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!selectedRule)
    return <p className="p-6 text-gray-500">No rule details available.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/rules")}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Rules
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Rule Details
            </h1>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/rules/edit/${selectedRule.id}`}
              className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>

        {/* Rule Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm text-gray-500">Title</h2>
            <p className="text-lg text-gray-800 font-medium">
              {selectedRule.title}
            </p>
          </div>

          

          {selectedRule.expression && (
            <div>
              <h2 className="text-sm text-gray-500">Expression</h2>
              <p className="text-gray-700">{selectedRule.expression}</p>
            </div>
          )}

          <div>
            <h2 className="text-sm text-gray-500">Created At</h2>
            <p className="text-gray-700">
              {new Date(selectedRule.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RuleDetailsPage;
