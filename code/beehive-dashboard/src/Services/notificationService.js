import axios from 'axios';

import { PARENT_API_URL } from './config';

const API_URL = `${PARENT_API_URL}/notification/`;

//retreive accessToken from localStorage

const getAccessToken = () => {
    const accessToken = JSON.parse(localStorage.getItem("user"));
    return accessToken;
    }

//Call the api to get the notification records

export const getNotificationRecords = async () => {
    const accessToken = getAccessToken();
    const response = await axios.get(`${API_URL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}
