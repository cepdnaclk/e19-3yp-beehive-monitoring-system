//Enpoint beehive-metrics
import axios from 'axios';
import { PARENT_API_URL } from './config';

const API_URL = `${PARENT_API_URL}/beehive-metrics/`;

//retreive accessToken from localStorage
const getAccessToken = () => {
    const accessToken = JSON.parse(localStorage.getItem("user"));
    return accessToken;
  };


//Call the api to get the beehive metrics
export const getBeehiveMetrics = async () => {
    const accessToken = getAccessToken();
    const response = await axios.get(`${API_URL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}

//Call the api to get the beehive metrics by id
export const getBeehiveMetricsByBeehiveId = async (id) => {
    const accessToken = getAccessToken();
    const response = await axios.get(`${API_URL}${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    console.log(response.data);
    return response.data;
}

export const downloadBeehiveMetricsCsv = async (beehive_id) => {
    const accessToken = getAccessToken();
    const response = await axios.get(`${API_URL}export/${beehive_id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    console.log(response.data);
    return response;
}
