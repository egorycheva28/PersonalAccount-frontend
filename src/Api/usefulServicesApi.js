import createAxiosInstance from "./axiosInstance";

const api = createAxiosInstance("api");

function getUsefulServices(category, page, pageSize) {
    return api.get(`/UsefulServices?categories=ForAll&${category}&page=${page}&pageSize=${pageSize}`)
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

export const usefulServicesApi = {
    getUsefulServices: getUsefulServices
}