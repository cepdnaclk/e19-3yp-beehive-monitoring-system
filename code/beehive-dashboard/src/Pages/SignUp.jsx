import React from 'react';
import Banner from "../Assets/Sign up Bee image.png";
import Polygon from "../Assets/Sign up Polygon.png";
import UserIcon from "../Assets/username.png";
import LockIcon from "../Assets/password.png";
import Logo from "../Assets/Logo.png";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../Styles/Pages/SignUp.scss';

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signIn = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            console.error("Please fill in both email and password.");
            return;
        }
        
        try {
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
        }
    };
      

  console.log('SignUp');
  return (
    <div>
        <div className="split left">
            <div className="signup-banner-container">
                <img src={Banner} alt="" className="signup-banner-image" />
            </div>
         </div>
        <div className="split right">
            <div className="centered">
                <img src={Polygon} alt="" className="polygon-image" />
                <div className="signup-form">
                    <form className='login_right' onSubmit={signIn}>
                        <Link to="/"><img src={Logo} alt="" className="signup-logo" /></Link>
                        <h3>Login to your account</h3>
                        <div className='inputs'>
                            <div className="input">
                                <img src={UserIcon} alt="" className="user-icon" />
                                <input
                                type="text"
                                id="username"
                                placeholder="Username"
                                onChange={(input) => {
                                    setEmail(input.target.value);
                                }}
                                />
                            </div>
                            <div className='input'>
                                <img src={LockIcon} alt="" className="lock-icon" />
                                <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                onChange={(input) => {
                                    setPassword(input.target.value);
                                }}
                                />
                            </div>
                        </div>
                        
                        <div className='signup-button'>
                            <button type="submit">SIGN UP</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SignUp;