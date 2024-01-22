import Logo from '../Assets/Logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import MenuIcon from "@mui/icons-material/Menu";  // Corrected import
import '../Styles/Components/Navbar.scss';

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  return (
    <div className='nav'>
      <div className="nav-logo">
        <Link to="/"><img src={Logo} alt='Logo' /></Link>
      </div>
      <div className="menu-icon" onClick={toggleNavbar}>
        <MenuIcon />
      </div>
      <ul className={`nav-menu  ${openLinks && 'active'}`}>
        <li className='nav-contact'><Link to="/contact">CONTACT US</Link></li>
        <li className='nav-signin'><Link to="/signin">SIGN IN</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;
