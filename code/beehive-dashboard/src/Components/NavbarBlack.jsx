import Logo from '../Assets/Logo.png';
import { Link } from 'react-router-dom';
import { useState,useContext } from 'react';
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
      <ul className="navb-menu">
        <li className='contact'><Link to="/contact">CONTACT US</Link></li>
        <li className='navb-signout'><Link to="/signin">SIGN OUT</Link></li>
      </ul>
    </div>
  );
}

export default NavbarBlack;
