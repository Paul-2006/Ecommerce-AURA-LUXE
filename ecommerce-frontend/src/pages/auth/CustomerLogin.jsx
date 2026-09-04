import {useState} from "react";
import axios from "axios";
import "../../css/Auth.css";
import {useNavigate} from "react-router-dom";


function CustomerLogin(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const navigate = useNavigate();



const login=async()=>{


try{


const res = await axios.post(

"http://localhost:5151/api/Auth/Login",

{
email,
password
}

);



localStorage.setItem(
"token",
res.data.token
);



alert("Login Successful");


navigate("/customer/dashboard");


}

catch(error){

alert("Login Failed");

}


};



return(


<div className="auth-container">


<div className="auth-box">


<h1>
Customer Login
</h1>



<input

placeholder="Email"

onChange={(e)=>
setEmail(e.target.value)
}

/>



<input

type="password"

placeholder="Password"

onChange={(e)=>
setPassword(e.target.value)
}

/>



<button onClick={login}>

Login

</button>



<p className="auth-link">

New customer? Register

</p>



</div>


</div>


);


}


export default CustomerLogin;