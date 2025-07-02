import createAxiosInstance from "./axiosInstance";

const api = createAxiosInstance("api");

function getPublicEvents(name, eventDate, timezoneOffset, page, pageSize) {
    return api.get(`/Events/public?name=${name}&eventDate=${eventDate}&timezoneOffset=${timezoneOffset}&page=${page}&pageSize=${pageSize}`)
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 500) {
                return { error: 500 };
            }
        });
}

function getAuthEvents(name, eventDate, timezoneOffset, page, pageSize) {
    return api.get(`/Events/public/auth?name=${name}&eventDate=${eventDate}&timezoneOffset=${timezoneOffset}&page=${page}&pageSize=${pageSize}`)
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

function getEventById(id) {
    return api.get(`/Events/public/${id}`)
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 500) {
                return { error: 500 };
            }
        });
}

function getEventIsParticipant(id) {
    return api.get(`/Events/is_participant/${id}`)
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

function registerInnerParticipant(id) {
    const body = {
        eventId: id
    }
    return api.post('/Events/register/inner', body)
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

function registerExternalParticipant(id, name, email, phone, additionalInfo) {
    const body = {
        eventId: id,
        name: name,
        email: email,
        phone: phone,
        additionalInfo: additionalInfo
    }
    return api.post('/Events/register/external', body)
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            if (error.status === 500) {
                return { error: 500 };
            }
        });
}

export const eventsApi = {
    getPublicEvents: getPublicEvents,
    getAuthEvents: getAuthEvents,
    getEventById: getEventById,
    getEventIsParticipant: getEventIsParticipant,
    registerInnerParticipant: registerInnerParticipant,
    registerExternalParticipant: registerExternalParticipant
}