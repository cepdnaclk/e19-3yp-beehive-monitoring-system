import axios from "axios";

import { PARENT_API_URL } from './config';

const API_URL = `${PARENT_API_URL}/beehive/`;
//Protected routes

//retreive accessToken from localStorage
const getAccessToken = () => {
  const accessToken = JSON.parse(localStorage.getItem("user"));
  return accessToken;
};


//get all beehives
export const getAllBeehives = async () => {
    console.log(getAccessToken());
  const response = await axios.get(API_URL + "", {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return response.data;
};



  


