import axios from 'axios';

import { PARENT_API_URL } from './config';

const API_URL = `${PARENT_API_URL}/camera/`;

//retreive accessToken from localStorage
const getAccessToken = () => {
    const accessToken = JSON.parse(localStorage.getItem("user"));
    return accessToken;
  };

//Call the api to get the camera records

export const getCameraRecords = async () => {
    const accessToken = getAccessToken();
    const response = await axios.get(`${API_URL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}

//Call the api to get the camera records by id

export const getCameraRecordByBeehiveId = async (id) => {
    const accessToken = getAccessToken();
    const response = await axios.get(`${API_URL}beehive/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    console.log(response.data);
    return response.data;
}
