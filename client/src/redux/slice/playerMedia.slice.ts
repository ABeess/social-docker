/* eslint-disable @typescript-eslint/no-empty-interface */
import { createSlice } from '@reduxjs/toolkit';
import { Maybe } from 'src/types';
import flv from 'flv.js';

const initialState: { playerMedia: Maybe<flv.Player> } = {
  playerMedia: null,
};

export const playerMediaSlice = createSlice({
  name: 'enable-query',
  initialState,
  reducers: {
    setPlayerMedia: (state, action) => {
      state.playerMedia = action.payload;
    },
  },
});

export const { setPlayerMedia } = playerMediaSlice.actions;

export default playerMediaSlice.reducer;
