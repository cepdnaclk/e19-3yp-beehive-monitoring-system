// Local demo. Use localhost when the browser runs on the same machine as the
// backend; swap in the host machine's LAN IP (e.g. http://192.168.43.10:5001/api)
// when the dashboard is opened from a different laptop on the hotspot.
// The port must match PORT in backend/.env.
export const PARENT_API_URL = 'http://localhost:5001/api';

// Retired AWS deployments, kept for reference.
// export const PARENT_API_URL = 'http://beehive-backend-1889726403:5000/api';
// export const PARENT_API_URL_2 = 'http://beehive-backend.eba-suumbhuc.ap-southeast-1.elasticbeanstalk.com/api';
// export const PARENT_API_URL2 = 'http://beehive-backend.eba-xkm8nww8.us-west-2.elasticbeanstalk.com/api';
