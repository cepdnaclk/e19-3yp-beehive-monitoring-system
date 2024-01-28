import React from "react";
import Banner2 from "../Assets/Bee w.jpg";
import Polygon from "../Assets/Sign up Polygon.png";
import LoginForm from "../Components/LoginForm";
import SignUpForm from "../Components/RegisterForm";

import { useState } from "react";

import "../Styles/Pages/SignIn.scss";
import { Button } from "@mui/material";

function SignIn() {
  const [isRegistered, setIsRegistered] = useState(true);

  console.log("SignIn");
  return (
    <div>
      <div className="split left">
        <div className="signin-banner-container">
          <img src={Banner2} alt="" className="signin-banner-image" />
        </div>
      </div>
      <div className="split right">
        <div className="color-overlay-sign"></div>
        <div className="centered">
          <img src={Polygon} alt="" className="polygon-image" />
          {isRegistered ? (
            <div className="signin-form">
              <LoginForm />
              <div className="change-button">
                <button  
                  onClick={() => {
                    setIsRegistered(false);
                  }}
                >
                  Havent Registered Yet
                </button>
              </div>
            </div>
          ) : (
            <div className="signin-form">
              <SignUpForm/>
              <div className="change-button">
                <button
                  onClick={() => {
                    setIsRegistered(true);
                  }}
                >
                  Already have an account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
