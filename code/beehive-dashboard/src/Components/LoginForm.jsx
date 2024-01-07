import UserIcon from "../Assets/username.png";
import LockIcon from "../Assets/password.png";
import Logo from "../Assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/Pages/SignIn.scss";

function LoginForm() {
  const [formData, setFormData] = useState({});
  const { login } = useContext(AuthContext);
  const [showInvalidCredentialsWarning, setShowInvalidCredentialsWarning] = useState(false);
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
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate("/dashboard");
    }
    else {
      setShowInvalidCredentialsWarning(true);
    }
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
            <img src={UserIcon} alt="" className="user-icon" />
            <input
              type="text"
              id="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="input">
            <img src={LockIcon} alt="" className="lock-icon" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <div>
            {showInvalidCredentialsWarning && <p>Invalid Credentials</p>}
          </div>
        </div>

        <div className="signin-button">
          <button type="submit">SIGN IN</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
