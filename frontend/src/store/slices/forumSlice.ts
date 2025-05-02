import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Forum {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
}

interface ForumState {
  forums: Forum[];
  loading: boolean;
  error: string | null;
}

const initialState: ForumState = {
  forums: [],
  loading: false,
  error: null,
};

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setForums(state, action: PayloadAction<Forum[]>) {
      state.forums = action.payload;
    },
    addForum(state, action: PayloadAction<Forum>) {
      state.forums.unshift(action.payload); 
    },
    updateForum(state, action: PayloadAction<Forum>) {
      const index = state.forums.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.forums[index] = action.payload;
      }
    },
    deleteForum(state, action: PayloadAction<number>) {
      state.forums = state.forums.filter(f => f.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { 
  setForums, 
  addForum, 
  updateForum, 
  deleteForum, 
  setLoading, 
  setError 
} = forumSlice.actions;

export default forumSlice.reducer;
