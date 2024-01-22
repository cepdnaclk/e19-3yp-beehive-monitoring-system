import React, { useState,useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/NavbarBlack';
import BeehiveCard from '../Components/BeehiveCard';
import AddCard from '../Components/AddCard';
import '../Styles/Pages/Dashboard.scss';
import { BeehiveContext } from '../Context/BeehiveContext';

function Dashboard() {
  const navigate = useNavigate();

  const { beehives, isLoading, isSyncing,setIsSyncing,fetchBeehives } = useContext(BeehiveContext);
  


  return (
    <div className="dashboard-container">
      <Navbar />
      {isLoading ? (
        <div className="loading-container">
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
        {!isSyncing ? (
          <button
          className="sync-button"
          onClick={() => {
            setIsSyncing(true); // Assuming this triggers a refresh of the beehive data in the context
            
          }}
          >
            Sync
          </button>
          ) : (<> 
          <p>Syncing...</p>
          
          </>)
          }
          <div className="beehive-cards-container">
            {beehives.map((data, index) => (
              <BeehiveCard key={index} beehiveData={data} />
            ))}
            {/* <AddCard /> */}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
