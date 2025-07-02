import axios from "axios";

const createAxiosInstance = (prefix = '') => {
    const instance = axios.create({
        baseURL: `https://lk-stud.api.kreosoft.space/${prefix}`,
        headers: {
            //'Content-Type': 'application/json',
            //'Accept': 'application/json'
        }
    });

    instance.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    async function refreshToken() {
        try {
            const response = await axios.post('https://lk-stud.api.kreosoft.space/api/Auth/refresh', {
                refreshToken: localStorage.getItem('refreshToken'),
            });


            if (response.status === 200) {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                return response.data.accessToken;
            }
        } catch (error) {
            console.error("Ошибка при обновлении токена:", error.response?.data || error.message);
            return null;
        }
    }

    instance.interceptors.response.use(response => {
        return response;
    }, async error => {
        if (!error.response) {
            console.log("Ошибка: Сервер не ответил!");
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (error.response.status === 401) {

            if (!originalRequest._retry) {
                originalRequest._retry = true;
                const newAccessToken = await refreshToken();

                if (!newAccessToken) {
                    console.log("Ошибка: Не удалось обновить токен!");
                    return Promise.reject(error);
                }
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            }
        }

        return Promise.reject(error);
    });

    return instance;
};

export default createAxiosInstance;
