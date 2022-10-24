import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Maybe } from 'src/types';
import { User, UserProfile } from 'src/types/Base';

export interface UserState {
  user: Maybe<User>;
  isAuthenticated: boolean;
  accessToken: string;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  accessToken: '',
};

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.accessToken = '';
      state.isAuthenticated = false;
      state.user = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateProfileRedux: (state, action: PayloadAction<UserProfile>) => {
      state.user = { ...state.user, profile: action.payload } as User;
    },
    updateAvatarRedux: (state, action) => {
      state.user = { ...state.user, avatar: action.payload } as User;
    },
    updateThumbnailRedux: (state, action: PayloadAction<string>) => {
      state.user = {
        ...state.user,
        profile: { ...state.user?.profile, thumbnail: action.payload } as UserProfile,
      } as User;
    },
  },
});

export const {
  userLogout,
  refreshToken,
  loginSuccess,
  updateUser,
  updateProfileRedux,
  updateAvatarRedux,
  updateThumbnailRedux,
} = userSlice.actions;

export default userSlice.reducer;
