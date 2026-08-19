import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../Components/NavbarBlack";
import HoneycombPattern from "../Components/HoneycombPattern";
import "../Styles/Pages/HiveDashboard.scss";

/*
Placeholder route. Nothing links here yet: the hive cards navigate to /graph,
which is where a hive's readings actually live. Kept on-theme so it does not
look broken if someone reaches it by typing the URL.
*/
function HiveDashboard() {
  const { hiveName } = useParams();
  const navigate = useNavigate();

  return (
    <div className="hive-dashboard-page">
      <Navbar />

      <main className="hive-dashboard-main">
        <div className="hive-dashboard-card">
          <HoneycombPattern
            id="hive-dashboard-comb"
            className="hive-dashboard-card__comb"
          />
          <div className="hive-dashboard-card__inner">
            <span className="hive-dashboard-card__eyebrow">Coming soon</span>
            <h1>{hiveName}</h1>
            <p>
              This view is not built yet. Open the hive from your dashboard to
              see its charts and readings.
            </p>
            <button type="button" onClick={() => navigate("/dashboard")}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HiveDashboard;
