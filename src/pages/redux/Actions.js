// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { userDetails } from '../../Api/Api';

const initialState = {
    loading: false,
    user: {},
    error: null
};

// Async thunk for fetching user details
export const getUserDetails = createAsyncThunk(
    'user/getUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.get(`${userDetails}`, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.user = {};
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer;
