import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { User, AuthState, RegisterType, LoginType } from '../../../interface';

const baseURL = "http://localhost:3000/"

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// 🔹 Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginType, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseURL+'auth/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: RegisterType, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// 🔹 Fetch current user from token
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Unable to fetch user');
    }
  }
);

// 🔹 Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
