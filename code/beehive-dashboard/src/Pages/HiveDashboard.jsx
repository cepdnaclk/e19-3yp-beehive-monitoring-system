import Navbar from "../Components/NavbarBlack";
import Banner from "../Assets/Banner.png";
import Hexagon from "../Assets/Hexagon-Design.png";
import { Link } from 'react-router-dom';
import '../Styles/Pages/HiveDashboard.scss';

function HiveDashboard() {
  console.log('Landing');
  return (
    <div className="hiveDashboard-container">
      <Navbar />
      
    </div>
  );
}

export default HiveDashboard;
