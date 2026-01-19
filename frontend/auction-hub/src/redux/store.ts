import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import auctionReducer from "./slices/auctionSlice"

export const Store=configureStore({
    reducer:{
        auth:authReducer,
        auctions:auctionReducer,
    },
});

export type RootState=ReturnType<typeof Store.getState>;
export type AppDispatch=typeof Store.dispatch;