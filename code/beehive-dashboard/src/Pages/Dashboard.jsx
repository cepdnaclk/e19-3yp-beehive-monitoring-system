import Navbar from "../Components/NavbarBlack";
import BeehiveCard from "../Components/BeehiveCard";
import '../Styles/Pages/Dashboard.scss';

function Dashboard() {
  console.log('Landing');

  const beehiveDataList = [
    { name: 'Beehive 01', humidity: '45%', temperature: '36.3 °C', co2Level: '550 ppm' },
    { name: 'Beehive 02', humidity: '40%', temperature: '35.5 °C', co2Level: '500 ppm' },
    { name: 'Beehive 03', humidity: '50%', temperature: '37.0 °C', co2Level: '600 ppm' },
    { name: 'Beehive 04', humidity: '42%', temperature: '34.8 °C', co2Level: '520 ppm' },
    { name: 'Beehive 05', humidity: '48%', temperature: '36.8 °C', co2Level: '580 ppm' },
    { name: 'Beehive 06', humidity: '39%', temperature: '35.2 °C', co2Level: '490 ppm' },
    { name: 'Beehive 07', humidity: '47%', temperature: '36.5 °C', co2Level: '570 ppm' },
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="beehive-cards-container">
        {beehiveDataList.map((data, index) => (
          <BeehiveCard key={index} beehiveData={data} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
