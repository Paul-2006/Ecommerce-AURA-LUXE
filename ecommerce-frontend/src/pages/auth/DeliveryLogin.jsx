import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Auth.css";


function DeliveryLogin(){


    const navigate = useNavigate();


    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");



    const login = async()=>{


        try{


            const res = await axios.post(

                "http://localhost:5151/api/Auth/Login",

                {
                    email: email,
                    password: password
                }

            );



            localStorage.setItem(
                "token",
                res.data.token
            );



            if(res.data.userId){

                localStorage.setItem(
                    "userId",
                    res.data.userId
                );

            }



            alert(
                "Delivery Partner Login Successful"
            );



            navigate("/delivery/dashboard");



        }
        catch(error){


            console.log(error);


            alert(
                "Delivery Login Failed"
            );


        }


    };



    return(


        <div className="auth-container">


            <div className="auth-box">


                <h2>
                    Delivery Partner Login
                </h2>



                <input

                    type="email"

                    placeholder="Enter Email"

                    value={email}

                    onChange={
                        (e)=>setEmail(e.target.value)
                    }

                />



                <input

                    type="password"

                    placeholder="Enter Password"

                    value={password}

                    onChange={
                        (e)=>setPassword(e.target.value)
                    }

                />



                <button onClick={login}>

                    Login

                </button>



            </div>


        </div>


    );


}


export default DeliveryLogin;