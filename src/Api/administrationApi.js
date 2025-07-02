import createAxiosInstance from "./axiosInstance";

const api = createAxiosInstance("api");

function getUsersList(email, name, filterLastName, page, pagesize) {
    return api.get(`/User/list?email=${email}&name=${name}&filterLastName=${filterLastName}&page=${page}&pageSize=${pagesize}`)
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

function getUserById(userId) {
    return api.get(`/User/${userId}`)
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

function createUsefulService(category, title, description, link, termsOfDisctribution, logoId) {
    const body = {
        category: category,
        title: title,
        description: description,
        link: link,
        termsOfDisctribution: termsOfDisctribution,
        logoId: logoId
    }

    return api.post('/UsefulServices', body)
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

function editUsefulService(id, category, title, description, link, termsOfDisctribution, logoId) {
    const body = {
        category: category,
        title: title,
        description: description,
        link: link,
        termsOfDisctribution: termsOfDisctribution,
        logoId: logoId
    }

    return api.put(`/UsefulServices/${id}`, body)
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

function deleteUsefulService(id) {
    return api.delete(`/UsefulServices/${id}`)
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

function getEvents(status, eventType, name, format, eventDate, timezoneOffset, page, pageSize) {
    return api.get(`/Events?status=${status}&eventType=${eventType}&name=${name}&format=${format}&eventDate=${eventDate}&timezoneOffset=420&page=${page}&pageSize=${pageSize}`)
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

function createEvent(title, description, digesText, pictureId, isTimeFromNeeded, dateTimeFrom, isTimeToNeeded, dateTimeTo, link,
    addressName, latitude, longitude, isRegistrationRequired, registrationLastDate, isDigestNeeded, notificationText, type, format, auditory) {
    const body = {
        title: title,
        description: description,
        digestText: digesText,
        pictureId: pictureId,
        isTimeFromNeeded: isTimeFromNeeded,
        dateTimeFrom: dateTimeFrom,
        isTimeToNeeded: isTimeToNeeded,
        dateTimeTo: dateTimeTo,
        link: link,
        addressName: addressName,
        latitude: latitude,
        longitude: longitude,
        isRegistrationRequired: isRegistrationRequired,
        registrationLastDate: registrationLastDate,
        isDigestNeeded: isDigestNeeded,
        notificationText: notificationText,
        type: type,
        format: format,
        auditory: auditory
    }

    return api.post('/Events', body)
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

function editEvent(title, description, digesText, pictureId, isTimeFromNeeded, dateTimeFrom, isTimeToNeeded, dateTimeTo, link,
    addressName, latitude, longitude, isRegistrationRequired, registrationLastDate, isDigestNeeded, notificationText, type, format, auditory, id) {
    const body = {
        title: title,
        description: description,
        digestText: digesText,
        pictureId: pictureId,
        isTimeFromNeeded: isTimeFromNeeded,
        dateTimeFrom: dateTimeFrom,
        isTimeToNeeded: isTimeToNeeded,
        dateTimeTo: dateTimeTo,
        link: link,
        addressName: addressName,
        latitude: latitude,
        longitude: longitude,
        isRegistrationRequired: isRegistrationRequired,
        registrationLastDate: registrationLastDate,
        isDigestNeeded: isDigestNeeded,
        notificationText: notificationText,
        type: type,
        format: format,
        auditory: auditory,
        id: id
    }

    return api.put('/Events', body)
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

function deleteEvent(id) {
    return api.delete(`/Events?id=${id}`)
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
    return api.get(`/Events/${id}`)
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

function editEventStatus(id, newStatus) {
    const body = {
        id: id,
        newStatus: newStatus
    }

    return api.put('/Events/status', body)
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

export const administrationApi = {
    getUsersList: getUsersList,
    getUserById: getUserById,
    createUsefulService: createUsefulService,
    editUsefulService: editUsefulService,
    deleteUsefulService: deleteUsefulService,
    getEvents: getEvents,
    createEvent: createEvent,
    editEvent: editEvent,
    deleteEvent: deleteEvent,
    getEventById: getEventById,
    editEventStatus: editEventStatus,
}