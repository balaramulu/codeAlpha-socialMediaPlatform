import React, { useState } from "react";
import './css/Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";


function Login(){

    const [username,setusername] = useState();
    const [password,setPassword] = useState();
    const [message , setMessage] = useState();
    const navigate = useNavigate();
    useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        navigate("/Home");
    }
    }, []);
    
    const handleSubmit = (e)=>{
        e.preventDefault();
        axios.post('http://localhost:3001/Login',{username , password})
        .then( result => {
            setMessage(result.data.message)
            if(result.data.success){
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username",result.data.user)
                navigate('/Home')
            }
        })
        .catch( error => {console.log(error)})
    }

    return (
        <>
        <h1 className="logo">Intaract Socials</h1>
            <div className="login-container">
             <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>
              <form className="login-form" onSubmit={handleSubmit}>
                 <h2>Login to your account</h2>
                    <input type="text" placeholder="User Name" value={username} onChange={(e) => setusername(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                    <p className="signup-link">
                        Don't have an account? <Link to={'/SignUp'}>SignUp</Link>
                    </p>
              </form>
            </div>    

        </>
    );

}

export default Login;   