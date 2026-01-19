import { createSlice } from "@reduxjs/toolkit";
import type  {PayloadAction} from "@reduxjs/toolkit";


interface AuctionState{
    allAuctions:any[],
    myAuctions:any[]
}

const initialState:AuctionState={
    allAuctions:[],
    myAuctions:[]
}

const auctionSlice=createSlice({
    name:'auction',
    initialState,
    reducers:{
    setAllAuctions:(state,action:PayloadAction<any[]>)=>{
        state.allAuctions=action.payload;
    },
    setMyAuctions:(state,action:PayloadAction<any[]>)=>{
        state.myAuctions=action.payload;
    },
    addAuction:(state,action:PayloadAction<any>)=>{
        state.allAuctions.push(action.payload);
        state.myAuctions.push(action.payload);
    },
    updateAuctionInStore:(state,action:PayloadAction<any>)=>{
        const indexAll=state.allAuctions.findIndex(a=>a.id === action.payload.id);
        if(indexAll!==-1) state.allAuctions[indexAll]=action.payload;
        const indexMy=state.myAuctions.findIndex(a=>a.id === action.payload.id);
        if(indexMy !== -1) state.myAuctions[indexMy] =action.payload;
    }
 }
})

export const {setAllAuctions, setMyAuctions, addAuction, updateAuctionInStore}= auctionSlice.actions;
export default auctionSlice.reducer;