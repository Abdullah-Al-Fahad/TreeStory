import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://fahaad.pythonanywhere.com/api/', // Base API URL
});

// Add a request interceptor to add token in the headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Get the refresh token from local storage
            const refreshToken = localStorage.getItem('refreshToken');
            
            // If there's a refresh token, attempt to refresh the access token
            if (refreshToken) {
                try {
                    const response = await axios.post('https://fahaad.pythonanywhere.com/api/auth/refresh/', {
                        refresh: refreshToken,
                    });
                    
                    // Store the new access token
                    localStorage.setItem('accessToken', response.data.access);

                    // Update the Authorization header and retry the original request
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return axios(originalRequest);
                } catch (error) {
                    console.error('Token refresh failed', error);
                }
            }
            
            // If refresh fails or no token is found, remove tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
