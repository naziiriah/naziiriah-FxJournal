import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Trade, TradeState } from "../../../interface";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // adjust if needed
const token = localStorage.getItem("token") || "";

const initialState: TradeState = {
  trades: [],
  selectedTrade: null,
  loading: false,
  error: null,
};

// --- THUNKS ---

// Get all trades
export const fetchTrades = createAsyncThunk<Trade[], void, { rejectValue: string }>(
  "trades/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`${baseURL}/trades/user/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch trades");
    }
  }
);

// Get trade by ID
export const fetchTradeById = createAsyncThunk<Trade, string, { rejectValue: string }>(
  "trades/fetchById",
  async (id, { rejectWithValue }) => {
    try {

      const response = await axios.get(`${baseURL}/trades/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch trade");
    }
  }
);

// Create trade
export const createTrade = createAsyncThunk<
  Trade,
  any,
  { rejectValue: string }
>("trades/create", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseURL}/trades/upload`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to create trade");
  }
});

// Update trade
export const updateTrade = createAsyncThunk<
  Trade,
  { id: string; data: any },
  { rejectValue: string }
>("trades/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await axios.put(`${baseURL}/trades/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update trade");
  }
});

// Delete trade
export const deleteTrade = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>("trades/delete", async ({ id }, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseURL}/trades/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete trade");
  }
});

// --- SLICE ---
const tradeSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    clearSelectedTrade: (state) => {
      state.selectedTrade = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action: PayloadAction<Trade[]>) => {
        state.loading = false;
        state.trades = action.payload;
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching trades";
      })

      // Fetch One
      .addCase(fetchTradeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTradeById.fulfilled, (state, action: PayloadAction<Trade>) => {
        state.loading = false;
        state.selectedTrade = action.payload;
      })
      .addCase(fetchTradeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching trade details";
      })

      // Create
      .addCase(createTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrade.fulfilled, (state, action: PayloadAction<Trade>) => {
        state.loading = false;
        state.trades.unshift(action.payload);
      })
      .addCase(createTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error creating trade";
      })

      // Update
      .addCase(updateTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrade.fulfilled, (state, action: PayloadAction<Trade>) => {
        state.loading = false;
        const index = state.trades.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trades[index] = action.payload;
        }
        if (state.selectedTrade?.id === action.payload.id) {
          state.selectedTrade = action.payload;
        }
      })
      .addCase(updateTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating trade";
      })

      // Delete
      .addCase(deleteTrade.fulfilled, (state, action: PayloadAction<string>) => {
        // state.trades = state.trades.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTrade.rejected, (state, action) => {
        state.error = action.payload || "Error deleting trade";
      });
  },
});

export const { clearSelectedTrade } = tradeSlice.actions;
export default tradeSlice.reducer;
