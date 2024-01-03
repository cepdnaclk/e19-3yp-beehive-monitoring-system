import Navbar from "../Components/NavbarBlack";
import { useParams } from 'react-router-dom';
import '../Styles/Pages/HiveDashboard.scss';

function HiveDashboard() {
  const { hiveName } = useParams();

  return (
    <div className="hiveDashboard-container">
      <Navbar />
      <h2>Hive Dashboard for {hiveName}</h2>
    </div>
  );
}

export default HiveDashboard;