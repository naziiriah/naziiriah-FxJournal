import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteRule, fetchRules } from "../../redux/resources/rule/ruleSlice";
import BottomNav from "../../components/BottomBar";

// Helper to get start of the week (Monday)
const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
  return new Date(d.setDate(diff));
};

// Format week nicely
const formatWeek = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export default function RulesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { rules, loading, error } = useSelector((state: RootState) => state.rule);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    dispatch(fetchRules(token));
  }, [dispatch]);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this rule?");
    if (!confirmed) return;


    dispatch(deleteRule({ id:id}));
  };

  const handleEdit = (id: string) => {
    navigate(`/rules/edit/${id}`);
  };
 const handleDetail = (id: string) => {
    navigate(`/rules/detail/${id}`);
  };
  // Group rules by week
  const rulesByWeek = rules.reduce((acc: Record<string, typeof rules>, rule) => {
    const weekStart = getWeekStart(new Date(rule.createdAt));
    const weekKey = formatWeek(weekStart);
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(rule);
    return acc;
  }, {});

  // Sort weeks newest first
  const sortedWeekKeys = Object.keys(rulesByWeek).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Rules</h1>
        <button
          onClick={() => navigate("/rules/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Create New Rule
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading rules...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && rules.length === 0 && !error && (
        <p className="text-gray-500">You haven’t created any rules yet.</p>
      )}

      {sortedWeekKeys.map((week) => (
        <div key={week} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Week of {week}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rulesByWeek[week].map((rule) => (
              <motion.div
                key={rule.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{rule.title}</h3>
                    {rule.expression && (
                      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{rule.expression}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      Created: {new Date(rule.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleDetail(rule.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(rule.id)}
                      className="p-2 rounded-lg hover:bg-gray-200 transition"
                      title="Edit Rule"
                    >
                      <PencilIcon className="w-5 h-5 text-indigo-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 rounded-lg hover:bg-gray-200 transition"
                      title="Delete Rule"
                    >
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      <BottomNav />
    </div>
  );
}
