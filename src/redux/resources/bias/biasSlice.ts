import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Bias, BiasState, BiasType } from "../../../interface";

const baseURL = "http://localhost:3000"

const initialState: BiasState = {
  items: [],
  loading: false,
  error: null,
};
const token = localStorage.getItem("token");

export const fetchBiases = createAsyncThunk<Bias[], void>(
  "bias/fetchBiases",
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(baseURL+ "/bias/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      return response.data as Bias[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch biases");
    }
  }
);

export const createBias = createAsyncThunk(
    "bias/upload",
    async (formData: FormData, { rejectWithValue }) => {
      
    try {
        
      const response = await axios.post(baseURL + "/bias/upload",formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        }
      });
      return response.data as Bias[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch biases");
    }
  }
);

// PUT /api/bias/:id
export const updateBias = createAsyncThunk(
  "bias/updateBias",
  async (
    { id, formData, token }: { id: string; formData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${baseURL}/bias/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update bias");
    }
  }
);

  


export const deleteBias = createAsyncThunk(
  "bias/deleteBias",
  async ({ id }: { id: string; }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseURL}/bias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; // return deleted bias ID for reducer
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete bias");
    }
  }
);

// In extraReducers


const biasSlice = createSlice({
  name: "bias",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBiases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBiases.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBiases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBias.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBias.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateBias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBias.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBias.rejected, (state, action )=> {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBias.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((r) => r.id !== action.payload);
      })
      ;
      
      
      ;
  },
});

export default biasSlice.reducer;
