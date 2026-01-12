import { createSlice ,type PayloadAction } from "@reduxjs/toolkit";

interface User {
    id:string;
    name:string;
    email:string;
    role:string;
}
interface AuthState{
    user:User|null;
    token:string | null; 
    isAuthenticated:boolean;
}

const storedUser=localStorage.getItem("user");
const storedToken=localStorage.getItem("token");
const initialState:AuthState={
    user:storedUser? JSON.parse(storedUser):null,
    token:storedToken||null,
    isAuthenticated: !!storedToken,
};

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action:PayloadAction<{user:User;token:string}>)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.isAuthenticated=true;

            localStorage.setItem('user',JSON.stringify(action.payload.user));
            localStorage.setItem('token',action.payload.token);
        },
        logout:(state)=>{
            state.user=null;
            state.token=null;
            state.isAuthenticated=false;

            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        updateAccessToken:(state,action:PayloadAction<string>)=>{
            state.token=action.payload;
            localStorage.setItem('token',action.payload);
        }
    }
});

export const {setCredentials,logout,updateAccessToken}=authSlice.actions;
export default authSlice.reducer;