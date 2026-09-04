import { useState } from "react";
import axios from "axios";
import "../css/Auth.css";
import { useNavigate } from "react-router-dom";


function Register(){


const [name,setName] = useState("");

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const navigate = useNavigate();



const register = async()=>{


try{


await axios.post(

"http://localhost:5151/api/Auth/Register",

{

name,

email,

password

}

);



alert("Registration Successful");


navigate("/customer/login");


}


catch(error){


console.log(error);

alert("Registration Failed");


}


};




return(

<div className="auth-container">


<div className="auth-box">


<h1>
Create Account
</h1>



<input

placeholder="Full Name"

onChange={(e)=>
setName(e.target.value)
}

/>



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



<button
onClick={register}
>

Register

</button>



<p className="auth-link">

Already have an account?
<br/>

Login from customer portal

</p>



</div>


</div>

);


}


export default Register;