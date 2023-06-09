import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWidgets = createAsyncThunk('dashboard/widgets/getWidgets', async () => {
  const response = await axios.get('/api/dashboard/widgets');
  const data = await response.data;

  return data;
});

const widgetsSlice = createSlice({
  name: 'dshboard/widgets',
  initialState: null,
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: (state, action) => action.payload,
  },
});

export const selectWidgets = ({ projectDashboardApp }) => projectDashboardApp.widgets;

export default widgetsSlice.reducer;
