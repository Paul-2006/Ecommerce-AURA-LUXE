import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import "../../css/Auth.css";


function SellerLogin(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const navigate = useNavigate();

const login=async()=>{

try{

const response=await axios.post(
"http://localhost:5151/api/Auth/Login",
{
email,
password
}
);


localStorage.setItem(
"token",
response.data.token
);


alert("Seller Login Successful");

navigate("/seller/dashboard");


}
catch{

alert("Login Failed");

}

};



return(

<div className="auth-container">

<div className="auth-box">

<h2>Seller Login</h2>


<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>


<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>


<button onClick={login}>
Login
</button>


</div>

</div>

);

}


export default SellerLogin;