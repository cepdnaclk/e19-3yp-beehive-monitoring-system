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
    </div>
  );
}

export default Landing;
