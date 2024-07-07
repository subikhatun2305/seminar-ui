// store.js
import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './userSlice';
import userReducer from "./Actions"

const store = configureStore({
    reducer: {
        userDetails: userReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;
