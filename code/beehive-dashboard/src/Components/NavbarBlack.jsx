import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import Logo from "../Assets/Logo.png";
import Notification from "./Notification";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/Components/NavbarBlack.scss";

function NavbarBlack() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    // The old navbar defined a logout handler but never attached it, so the
    // link navigated to /signin while the token stayed in localStorage.
    logout();
    navigate("/signin");
  };

  return (
    <header className="navb">
      <div className="navb__inner">
        <Link to="/dashboard" className="navb__logo">
          <img src={Logo} alt="BeeZee" />
        </Link>

        <button
          type="button"
          className="navb__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>

        <nav className={`navb__actions${menuOpen ? " is-open" : ""}`}>
          <Notification />
          <button type="button" className="navb__signout" onClick={handleSignOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Sign out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default NavbarBlack;
