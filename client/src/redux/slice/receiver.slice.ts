import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ReceiverType = Array<string>;

const initialState: ReceiverType = [];

export const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setReceiver: (_, action: PayloadAction<ReceiverType>) => action.payload,
    resetReceiver: () => [],
  },
});

export const { setReceiver, resetReceiver } = receiverSlice.actions;

export default receiverSlice.reducer;
