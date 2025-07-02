import createAxiosInstance from "./axiosInstance";

const api = createAxiosInstance("api");

function getProfile() {
    return api.get("/Profile")
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 401) {
                return { error: 401 };
            }
            if (error.status === 403) {
                return { error: 403 };
            }
            if (error.status === 404) {
                return { error: 404 };
            }
            if (error.status === 500) {
                return { error: 500 };
            }
        });
}

function getProfileStudent() {
    return api.get("/Profile/student")
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 401) {
                return { error: 401 };
            }
            if (error.status === 403) {
                return { error: 403 };
            }
            if (error.status === 500) {
                return { error: 500 };
            }
        });
}

function getProfileEmployee() {
    return api.get("/Profile/employee")
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 401) {
                return { error: 401 };
            }
            if (error.status === 403) {
                return { error: 403 };
            }
            if (error.status === 500) {
                return { error: 500 };
            }
        });
}

function editAvatar(id) {
    const body = {
        fileId: id
    }

    return api.put("/Profile/avatar", body)
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 401) {
                return { error: 401 };
            }
            if (error.status === 403) {
                return { error: 403 };
            }
            if (error.status === 500) {
                return { error: 500 };
            }
        });
}

export const profileApi = {
    getProfile: getProfile,
    getProfileStudent: getProfileStudent,
    getProfileEmployee: getProfileEmployee,
    editAvatar: editAvatar
}