import Logo from '../Assets/Logo.png';
import { Link } from 'react-router-dom';
import { useState,useContext } from 'react';
import MenuIcon from "@mui/icons-material/Menu";
import '../Styles/Components/NavbarBlack.scss';
import { AuthContext } from '../Context/AuthContext';



function NavbarBlack() {
  const [openLinks, setOpenLinks] = useState(false);
  const { logout } = useContext(AuthContext);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const handleLogout = () => {
    logout();
  }

  return (
    <div className='navb'>
      <div className="navb-logo">
        <Link to="/"><img src={Logo} alt='Logo' /></Link>
      </div>
      <div className="menub-icon" onClick={toggleNavbar}>
        <MenuIcon />
      </div>
      <ul className={`navb-menu  ${openLinks && 'active'}`}>
        <li className='navb-signout'><Link to="/signin">SIGN OUT</Link></li>
      </ul>
    </div>
  );
}

export default NavbarBlack;
