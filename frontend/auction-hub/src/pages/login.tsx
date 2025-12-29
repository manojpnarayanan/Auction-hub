// import { useState } from "react";



export default function Login(){
    // const [email,setEmail]=useState('');
    // const [password,setPassword]=useState("");


    const handleGoogleLogin=()=>{

    window.location.href='http://localhost:3000/user/auth/google';
}

return(
    <div>
        <button onClick={handleGoogleLogin} > Sign in with Google </button>
    </div>
)




}