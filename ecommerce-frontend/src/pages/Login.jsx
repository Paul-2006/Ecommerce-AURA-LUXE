import {useState,useContext} from "react";

import api from "../api/axios";

import {AuthContext} from "../context/AuthContext";

import {useNavigate} from "react-router-dom";



function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");



const {login}=useContext(AuthContext);


const navigate=useNavigate();




const submit=async(e)=>{


e.preventDefault();



try{


const response =
await api.post("/Auth/Login",
{

email,
password

});



login(response.data);



alert("Login Successful");


navigate("/products");


}

catch(error){

alert("Invalid Login");

}


};




return(

<div>


<h2>Login</h2>


<form onSubmit={submit}>


<input

placeholder="Email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

/>



<input

type="password"

placeholder="Password"

value={password}

onChange={
e=>setPassword(e.target.value)
}

/>


<button>

Login

</button>


</form>


</div>

);


}


export default Login;