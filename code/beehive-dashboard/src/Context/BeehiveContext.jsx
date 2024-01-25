import React, { createContext, useState, useEffect } from 'react';
import {getAllBeehives} from '../Services/beehiveService';

export const BeehiveContext = createContext();

export const BeehiveProvider = ({ children }) => {
  const [beehives, setBeehives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchBeehives = async () => {
    setIsLoading(true);
    
   await getAllBeehives()
      .then((beehives) => {
        console.log("Successfully fetched beehives:", beehives);
        setBeehives(beehives.beehives);
      })
      .catch((error) => {
        console.error("Failed to fetch beehives:", error);
      })
      .finally(() => {
        setIsLoading(false);
        
      });
      return Promise.resolve();
  };

  const syncFetchBeehives = () => {
    
    
    getAllBeehives()
      .then((beehives) => {
        console.log("Successfully fetched beehives:", beehives);
        setBeehives(beehives.beehives);
      })
      .catch((error) => {
        console.error("Failed to fetch beehives:", error);
      })
      .finally(() => {
        
        
      });
      return Promise.resolve();
  };

  useEffect(() => {
    fetchBeehives();
  }, []);

  useEffect(() => {
    if (isSyncing) {
      syncFetchBeehives() // Assuming this is the sync operation
        .then(() => {
          setIsSyncing(false); // Set isSyncing to false once sync is complete
        })
        .catch(error => {
          console.error("Sync failed:", error);
          setIsSyncing(false); // Also set isSyncing to false in case of an error
        });
    }
  }, [isSyncing]);

  return (
    <BeehiveContext.Provider
      value={{ beehives, fetchBeehives }}
    >
      {children}
    </BeehiveContext.Provider>
  );
};
