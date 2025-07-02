import createAxiosInstance from "./axiosInstance";

const api = createAxiosInstance("api");

function getCertificates(userType, ownerId) {
    return api.get(`/Certificates/userType/${userType}/entity/${ownerId}`)
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

function createCertificate(type, staffType, userType, educationEntryId, employeePostId, receiveType) {
    const body = {
        type: type,
        staffType: staffType,
        userType: userType,
        educationEntryId: educationEntryId,
        employeePostId: employeePostId,
        receiveType: receiveType
    }

    return api.post("/Certificates", body)
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 400) {
                return { error: 400 };
            }
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

export const certificatesApi = {
    getCertificates: getCertificates,
    createCertificate: createCertificate
}