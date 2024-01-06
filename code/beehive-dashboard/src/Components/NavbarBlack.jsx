import Logo from '../Assets/Logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../Styles/Components/NavbarBlack.scss';

function NavbarBlack() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  return (
    <div className='navb'>
      <div className="navb-logo">
        <Link to="/"><img src={Logo} alt='Logo' /></Link>
      </div>
      <ul className="navb-menu">
        <li className='contact'><Link to="/contact">CONTACT US</Link></li>
        <li className='navb-signout'><Link to="/">SIGN OUT</Link></li>
      </ul>
    </div>
  );
}

export default NavbarBlack;
