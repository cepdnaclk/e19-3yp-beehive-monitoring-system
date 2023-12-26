import React from 'react';
import Banner from "../Assets/Sign up Bee image.png";
import Polygon from "../Assets/Sign up Polygon.png";
import '../Styles/Pages/SignUp.scss';

function SignUp() {
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
            </div>
        </div>
    </div>
  );
}

export default SignUp;