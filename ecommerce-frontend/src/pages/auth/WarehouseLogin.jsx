import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Auth.css";


function WarehouseLogin(){


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



            alert("Warehouse Login Successful");



            navigate("/warehouse/dashboard");



        }
        catch(error){


            console.log(error);


            alert("Login Failed");


        }


    };



    return(


        <div className="auth-container">


            <div className="auth-box">


                <h2>
                    Warehouse Login
                </h2>



                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={
                        (e)=>setEmail(e.target.value)
                    }

                />



                <input

                    type="password"

                    placeholder="Password"

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


export default WarehouseLogin;