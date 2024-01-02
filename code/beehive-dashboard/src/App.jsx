import "./App.scss";
import Landing from "./Pages/Landing";
import SignIn from "./Pages/SignIn";
import Dashboard from "./Pages/Dashboard";
import Graphs from "./Pages/Graphs";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/graph" element={<Graphs />} />
      </Routes>
    </div>
  );
}

export default App;