// Landing.jsx
import Navbar from "../Components/Navbar";
import Banner from "../Assets/Banner.png";
import '../Styles/Landing.scss';

function Landing() {
  console.log('Landing');
  return (
    <div className="landing-container">
      <Navbar />
      <div className="banner-container">
        <img src={Banner} alt="" className="banner-image" />
        <div className="color-overlay"></div>
      </div>
      <div className="content-container">
        <h3>Monitoring Hives, Nurturing Lives.</h3>
        <p>Harvesting insights from the heartbeat of nature, our beehive monitoring system buzzes with intelligence, ensuring the sweet success of both bees and beekeepers alike.</p>
      </div>
    </div>
  );
}

export default Landing;
