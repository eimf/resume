import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  isAdmin: boolean;
  animationsEnabled: boolean;
  activeSection: string | null;
}

const initialState: ProfileState = {
  isAdmin: !!localStorage.getItem('admin_token'),
  animationsEnabled: true,
  activeSection: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setAnimationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.animationsEnabled = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<string | null>) => {
      state.activeSection = action.payload;
    },
  },
});

export const { setAdmin, setAnimationsEnabled, setActiveSection } = profileSlice.actions;
export default profileSlice.reducer;
