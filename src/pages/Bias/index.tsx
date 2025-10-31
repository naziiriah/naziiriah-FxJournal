import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { motion } from "framer-motion";
import { fetchBiases, deleteBias } from "../../redux/resources/bias/biasSlice";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomBar";

// Helper to get start of week (Monday)
const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
  return new Date(d.setDate(diff));
};

// Format a date nicely
const formatWeek = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export default function BiasPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state: RootState) => state.bias);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    dispatch(fetchBiases());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this bias?");
    if (!confirmed) return;
    dispatch(deleteBias({ id}));
  };

  const handleEdit = (id: string) => {
    navigate(`/bias/edit/${id}`);
  };

  // Group biases by week
  const biasesByWeek = items.reduce((acc: Record<string, typeof items>, bias) => {
    const weekStart = getWeekStart(new Date(bias.createdAt));
    const weekKey = formatWeek(weekStart);
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(bias);
    return acc;
  }, {});

   // Sort weeks newest first
  const sortedWeekKeys = Object.keys(biasesByWeek).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Biases</h1>
        <button
          onClick={() => navigate("/bias/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Create New Bias
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading biases...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && items.length === 0 && !error && (
        <p className="text-gray-500">You haven’t created any biases yet.</p>
      )}

      {/* Render grouped by week */}
      {sortedWeekKeys.map((week) => (
        <div key={week} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{week}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {biasesByWeek[week].map((bias) => (
              <motion.div
                key={bias.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
              >
                {bias.beforeImageUrl && (
                  <img
                    src={"http://localhost:3000"+bias.beforeImageUrl}
                    alt={bias.title}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{bias.title}</h3>
                    <p className="text-sm text-gray-500">{bias.currencyPair}</p>

                    {bias.description && (
                      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{bias.description}</p>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Created: {new Date(bias.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(bias.id)}
                      className="flex-1 bg-indigo-600 text-white py-1 rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bias.id)}
                      className="flex-1 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      Delete
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
