import axios from 'axios';

import { PARENT_API_URL } from './config';

const API_URL = `${PARENT_API_URL}/notifications/`;

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
//Call the api to update all notification records (mark as read)
export const updateAllNotificationRecords = async () => {
    const accessToken = getAccessToken();
    const response = await axios.put(`${API_URL}`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    console.log(response.data);
    return response.data;
}

// Call the api to update a notification record (mark as read)
export const updateNotificationRecord = async (id) => {
    const accessToken = getAccessToken();
    console.log(accessToken);
    const response = await axios.put(`${API_URL}${id}`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}
