import "./App.scss";
import Landing from "./Pages/Landing";
import SignIn from "./Pages/SignIn";
import Dashboard from "./Pages/Dashboard";
import Graphs from "./Pages/Graphs";
import HiveDashboard from "./Pages/HiveDashboard";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/graph" element={<Graphs />} />
          <Route path="/hive-dashboard/:hiveName" element={<HiveDashboard />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
