import axios from "axios";

const API_URL=import.meta.env.VITE_API_URL

const API=axios.create({baseURL:API_URL})


export const signup=(data:{name:string,email:string,password:string})=>API.post("/user/signup",data);
export const login=(data:{email:string,password:string})=>API.post("/user/login",data)