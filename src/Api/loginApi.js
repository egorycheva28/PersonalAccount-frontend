import createAxiosInstance from "./axiosInstance";

const api = createAxiosInstance("api");

function loginUser(email, password, rememberMe) {
    const body = {
        email: email,
        password: password,
        rememberMe: rememberMe
    }

    return api.post("/Auth/login", body)
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 400) {
                return { error: 'Невалидный email!' };
            }
            if (error.status === 500) {
                return { error: 'Ошибка сети!' };
            }
        });
}

function logoutUser() {
    return api.post("/Auth/logout", {})
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response;
            }
        })
        .catch(error => {
            console.log(error.response.data.error)
        });
}

export const userApi = {
    loginUser: loginUser,
    logoutUser: logoutUser
}