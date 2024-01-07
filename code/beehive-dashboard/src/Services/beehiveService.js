import axios from "axios";

const API_URL = "http://localhost:5001/api/beehive";
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



  


