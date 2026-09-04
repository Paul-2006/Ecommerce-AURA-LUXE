import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../../css/Auth.css";


function AdminLogin(){

const navigate = useNavigate();


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");



const login=async()=>{


try{


const response = await axios.post(

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



alert("Admin Login Successful");


navigate("/admin/dashboard");


}
catch(error){


console.log(error);

alert("Admin Login Failed");


}


};



return(

<div className="auth-container">


<div className="auth-box">


<h2>
Admin Login
</h2>



<input

type="email"

placeholder="Enter Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>



<input

type="password"

placeholder="Enter Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



<button onClick={login}>

Login

</button>



</div>


</div>

);


}


export default AdminLogin;