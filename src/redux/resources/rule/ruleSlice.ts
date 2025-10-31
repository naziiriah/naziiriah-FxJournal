import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Rule, RuleType } from "../../../interface";

const baseURL = "http://localhost:3000"; // replace with your backend URL
const token = localStorage.getItem("token");
// Rule Type


// Slice State
interface RulesState {
  rules: RuleType[];
  selectedRule:Rule | null;
  loading: boolean;
  error: string | null;
}

const initialState: RulesState = {
  rules: [],
  loading: false,
  error: null,
  selectedRule: null
};

// -------------------- THUNKS --------------------
export const fetchRuleByID = createAsyncThunk< Rule,
  { id: string}
>(
  "rules/fetchRuleByID",
  async ({ id}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/rules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update rule");
    }
  })
// Fetch all rules
export const fetchRules = createAsyncThunk<RuleType[], string>(
  "rules/fetchRules",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/rules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch rules");
    }
  }
);

// Create a new rule
export const createRule = createAsyncThunk<RuleType, {  data: Partial<RuleType> }>(
  "rules/createRule",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/rules`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create rule");
    }
  }
);

// Update a rule
export const updateRule = createAsyncThunk<
  RuleType,
  { id: string; data: Partial<RuleType> }
>(
  "rules/updateRule",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseURL}/rules/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update rule");
    }
  }
);

// Delete a rule
export const deleteRule = createAsyncThunk<
   string,
  { id: string },
  { rejectValue: string }
>("rules/deleteRule", async ({ id }, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseURL}/rules/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete rule");
  }
});

// -------------------- SLICE --------------------
const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Rules
    builder.addCase(fetchRules.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRules.fulfilled, (state, action: PayloadAction<RuleType[]>) => {
      state.loading = false;
      state.rules = action.payload;
    });
    builder.addCase(fetchRules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    

    // Create Rule
    builder.addCase(createRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRule.fulfilled, (state, action: PayloadAction<RuleType>) => {
      state.loading = false;
      state.rules.unshift(action.payload); // add to top
    });
    builder.addCase(createRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Rule
    builder.addCase(updateRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRule.fulfilled, (state, action: PayloadAction<RuleType>) => {
      state.loading = false;
      const index = state.rules.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.rules[index] = action.payload;
    });
    builder.addCase(updateRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

     // Fetch One
    builder.addCase(fetchRuleByID.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchRuleByID.fulfilled, (state, action: PayloadAction<Rule>) => {
      state.loading = false;
      state.selectedRule = action.payload;
    })
    .addCase(fetchRuleByID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // Delete Rule
    builder.addCase(deleteRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRule.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.rules = state.rules.filter((r) => r.id !== action.payload);
    });
    builder.addCase(deleteRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default rulesSlice.reducer;
