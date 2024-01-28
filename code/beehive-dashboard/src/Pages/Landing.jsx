import Navbar from "../Components/Navbar";
import Banner from "../Assets/Banner.png";
import Hexagon from "../Assets/Hexagon-Design.png";
import { Link } from 'react-router-dom';
import '../Styles/Pages/Landing.scss';

function Landing() {
  console.log('Landing');
  return (
    <div className="landing-container">
      <Navbar />
      <div className="banner-container">
        <img src={Banner} alt="" className="banner-image" />
        <div className="color-overlay"></div>
      </div>
      <div className="hexagon-design">
        <img src={Hexagon} alt="" />
      </div>
      <div className="content-container">
        <h3>Monitoring Hives, Nurturing Lives.</h3>
        <p>Harvesting insights from the heartbeat of nature, our beehive monitoring system buzzes with intelligence, ensuring the sweet success of both bees and beekeepers alike.</p>
        <Link to="/signin" className="learn-more">SIGN IN</Link>
      </div>
    </div>
  );
}

export default Landing;
