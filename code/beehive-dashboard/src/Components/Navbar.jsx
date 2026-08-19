import { Link } from "react-router-dom";
import Logo from "../Assets/Logo.png";
import "../Styles/Components/Navbar.scss";

/*
Landing-page bar only. It sits transparently over the hero rather than in the
document flow, so the photo runs the full height of the viewport behind it.
There is a single action, so it needs no hamburger; the old one collapsed one
link into a full-height sliding overlay.
*/
function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__logo">
          <img src={Logo} alt="BeeZee" />
        </Link>

        <Link to="/signin" className="nav__signin">
          Sign in
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
