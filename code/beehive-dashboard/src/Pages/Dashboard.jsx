import Navbar from "../Components/NavbarBlack";
import Banner from "../Assets/Banner.png";
import Hexagon from "../Assets/Hexagon-Design.png";
import { Link } from 'react-router-dom';
import '../Styles/Pages/Dashboard.scss';

function Dashboard() {
  console.log('Landing');
  return (
    <div className="dashboard-container">
      <Navbar />
      
    </div>
  );
}

export default Dashboard;
