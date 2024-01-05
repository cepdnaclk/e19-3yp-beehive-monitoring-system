import Logo from "../Assets/Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faUser,
  faLock,

} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/Pages/SignIn.scss";

function RegisterForm() {
  const [formData, setFormData] = useState({});
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  //Add Some Error handling

  const handleLogin = async (e) => {
    e.preventDefault();
    if (register(formData.username, formData.email, formData.password)) {
      navigate("/dashboard");
    }
  };

  const handlePasswordMatchCheck = (e) => {
    if (e.target.value === formData.password) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <form className="login_right" onSubmit={handleLogin}>
        <Link to="/">
          <img src={Logo} alt="" className="signin-logo" />
        </Link>
        <h3>Login to your account</h3>
        <div className="inputs">
          <div className="input">
          <div className="email-icon">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <input
              type="text"
              id="username"
              placeholder="Username"
              onChange={handleChange}
            />
          </div>
          <div className="input">
            <div className="email-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="text"
              id="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="input">
          <div className="email-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {/* Font Awesome Icon for Show/Hide Password */}
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={toggleShowPassword}
            />
          </div>
          <div classname="input-container">
            <div className="input">
              <div className="email-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
              <input
                type="password"
                id="password"
                placeholder="Retype Password"
                onChange={handlePasswordMatchCheck}
              />
            </div>

            <p style={{ color: "red" }}>
              {passwordMatch ? "" : "Passwords do not match"}
            </p>
          </div>
        </div>

        <div className="signin-button">
          <button type="submit">SIGN UP</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
