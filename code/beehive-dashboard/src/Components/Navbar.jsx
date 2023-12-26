import Logo from '../Assets/Logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
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
      <ul className="nav-menu">
        <li><Link to="/contact">CONTACT US</Link></li>
        <li className='nav-signup'><Link to="/signup">SIGN UP</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;
