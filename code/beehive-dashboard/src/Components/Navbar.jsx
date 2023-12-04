import Logo from '../Assets/Logo.png';
import SignUp from '../Assets/SignUp.png';
import { Link } from 'react-router-dom';
import ReorderIcon from '@mui/icons-material/Reorder';
import { useState } from 'react';
import '../Styles/Components/Navbar.scss';

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  return (
    <div className='navbar'>
      <div className='leftSide' id={openLinks ? "open" : "close"}>
        <Link to="/"><img src={Logo} alt='Logo' /></Link>
        <div className="hiddenLinks">
          <Link to="/contactUs">Contact Us</Link>
        </div>
      </div>
      <div className='rightSide'>
        <Link to="/contactUs">Contact Us</Link>
        <button className="signUpButton">
          <Link to="/signUp">
            Sign Up <img src={SignUp} alt="" />
          </Link>
        </button>
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
