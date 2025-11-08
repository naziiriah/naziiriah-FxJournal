import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Review } from "../../../interface";

const API_URL = "http://localhost:3000"; // replace with your backend URL
const token = localStorage.getItem("token");
 
export interface ReviewType {
  id: string;
  review: string;
  errorCheck: boolean;
  errorDescriptions: string[];
  rating: number;
  createdAt: string;
}

interface ReviewState {
  items: ReviewType[];
  selectedReview: ReviewType | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  items: [],
  selectedReview: null,
  loading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk("reviews/fetchAll", async (_, thunkAPI) => {
  try {
    
    const res = await axios.get(`${API_URL}/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching reviews");
  }
});


// Fetch review by ID
export const fetchReviewById = createAsyncThunk(
  "reviews/fetchById",
  async (id: string) => {
    const res = await axios.get(`${API_URL}/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// Create new review
export const createReview = createAsyncThunk(
  "reviews/create",
  async (data: Partial<Review>) => {
    const newData = {
      review: data.review,
      errorCheck: data.errorCheck,
      errorDescriptions: data.errorDescriptions,
      rating: Number(data.rating),
    }
    const res = await axios.post(`${API_URL}/reviews`,newData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// Update existing review
export const updateReview = createAsyncThunk(
  "reviews/update",
  async (data: { id: string } & Partial<Review>) => {
    const { id, ...body } = data;
    const res = await axios.put(`${API_URL}/reviews/${id}`,body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const deleteReview = createAsyncThunk("reviews/delete", async (id: string, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Error deleting review");
  }
});

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        
      })
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchReviewById.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.selectedReview = action.payload
        state.loading = false;
      });
  },
});

export default reviewSlice.reducer;
