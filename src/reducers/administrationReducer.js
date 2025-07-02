import { administrationApi } from "../Api/administrationApi";

const GET_USERS_LIST = "GET_USERS_LIST";
const GET_USER_BY_ID = "GET_USER_BY_ID";
const CREATE_USEFUL_SERVICE = "CREATE_USEFUL_SERVICE";
const EDIT_USEFUL_SERVICE = "EDIT_USEFUL_SERVICE";
const DELETE_USEFUL_SERVICE = "DELETE_USEFUL_SERVICE";
const GET_EVENTS = "GET_EVENTS";
const CREATE_EVENT = "CREATE_EVENT";
const EDIT_EVENT = "EDIT_EVENT";
const DELETE_EVENT = "DELETE_EVENT";
const GET_EVENT_BY_ID = "GET_EVENT_BY_ID";
const EDIT_EVENT_STATUS = "EDIT_EVENT_STATUS";

let initialState = {
    profile: {
        id: '',
        email: '',
        lastName: '',
        firstName: '',
        patronymic: '',
        birthDate: '',
        gender: '',
        avatar: {
            id: '',
            name: '',
            extension: '',
            size: ''
        },
        citizenship: {
            code: '',
            id: '',
            name: ''
        },
        address: '',
        contacts: [],
        userTypes: []
    },
    results: [{
        id: '',
        category: '',
        title: '',
        description: '',
        link: '',
        termsOfDisctribution: '',
        logo: {
            id: '',
            name: '',
            extension: '',
            size: ''
        }
    }],
    metaData: {
        pageCount: '',
        totalItemCount: '',
        pageNumber: '',
        pageSize: '',
        hasPreviousPage: '',
        hasNextPage: '',
        isFirstPage: '',
        isLastPage: '',
        firstItemOnPage: '',
        lastItemOnPage: ''
    },
    logoId: '',
    event: {},
    id: ''
}

const administrationReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_USERS_LIST:
            newState.results = action.results;
            newState.metaData = action.metaData;
            return newState;
        case GET_USER_BY_ID:
            newState.profile = action.profile;
            return newState;
        case CREATE_USEFUL_SERVICE:
            return newState;
        case EDIT_USEFUL_SERVICE:
            return newState;
        case DELETE_USEFUL_SERVICE:
            return newState;
        case GET_EVENTS:
            newState.results = action.results;
            newState.metaData = action.metaData;
            return newState;
        case CREATE_EVENT:
            newState.id = action.id;
            return newState;
        case EDIT_EVENT:
            return newState;
        case DELETE_EVENT:
            return newState;
        case GET_EVENT_BY_ID:
            newState.event = action.event;
            return newState;
        case EDIT_EVENT_STATUS:
            return newState;
        default:
            return newState;
    }
}

export function getUsersListActionCreator(data) { //обращение к reducers
    return { type: GET_USERS_LIST, results: data.results, metaData: data.metaData }
}

export function getUsersListThunkCreator(email, name, filterLastName, page, pagesize) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.getUsersList(email, name, filterLastName, page, pagesize);
            dispatch(getUsersListActionCreator(data));

            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getUserByIdActionCreator(data) { //обращение к reducers
    return { type: GET_USER_BY_ID, profile: data }
}

export function getUserByIdThunkCreator(userId) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.getUserById(userId);
            dispatch(getUserByIdActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function createUsefulServiceActionCreator() { //обращение к reducers
    return { type: CREATE_USEFUL_SERVICE }
}

export function createUsefulServiceThunkCreator(category, title, description, link, termsOfDisctribution, logoId) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.createUsefulService(category, title, description, link, termsOfDisctribution, logoId);
            console.log(data);
            dispatch(createUsefulServiceActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function editUsefulServiceActionCreator() { //обращение к reducers
    return { type: EDIT_USEFUL_SERVICE }
}

export function editUsefulServiceThunkCreator(id, category, title, description, link, termsOfDisctribution, logoId) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.editUsefulService(id, category, title, description, link, termsOfDisctribution, logoId);
            console.log(data);
            dispatch(editUsefulServiceActionCreator());
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function deleteUsefulServiceActionCreator() { //обращение к reducers
    return { type: DELETE_USEFUL_SERVICE }
}

export function deleteUsefulServiceThunkCreator(id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.deleteUsefulService(id);
            console.log(data);
            dispatch(deleteUsefulServiceActionCreator());
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getEventsActionCreator(data) { //обращение к reducers
    return { type: GET_EVENTS, results: data.results, metaData: data.metaData }
}

export function getEventsThunkCreator(status, eventType, name, format, eventDate, timezoneOffset, page, pageSize) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.getEvents(status, eventType, name, format, eventDate, timezoneOffset, page, pageSize);
            console.log(data);
            dispatch(getEventsActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function createEventActionCreator(data) { //обращение к reducers
    return { type: CREATE_EVENT, id: data.id }
}

export function createEventThunkCreator(title, description, digesText, pictureId, isTimeFromNeeded, dateTimeFrom, isTimeToNeeded, dateTimeTo, link,
    addressName, latitude, longitude, isRegistrationRequired, registrationLastDate, isDigestNeeded, notificationText, type, format, auditory) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.createEvent(title, description, digesText, pictureId, isTimeFromNeeded, dateTimeFrom, isTimeToNeeded, dateTimeTo, link,
                addressName, latitude, longitude, isRegistrationRequired, registrationLastDate, isDigestNeeded, notificationText, type, format, auditory);
            console.log(data);
            dispatch(createEventActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function editEventActionCreator() { //обращение к reducers
    return { type: EDIT_EVENT }
}

export function editEventThunkCreator(title, description, digesText, pictureId, isTimeFromNeeded, dateTimeFrom, isTimeToNeeded, dateTimeTo, link,
    addressName, latitude, longitude, isRegistrationRequired, registrationLastDate, isDigestNeeded, notificationText, type, format, auditory, id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.editEvent(title, description, digesText, pictureId, isTimeFromNeeded, dateTimeFrom, isTimeToNeeded, dateTimeTo, link,
                addressName, latitude, longitude, isRegistrationRequired, registrationLastDate, isDigestNeeded, notificationText, type, format, auditory, id);
            console.log(data);
            dispatch(editEventActionCreator());
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function deleteEventActionCreator() { //обращение к reducers
    return { type: DELETE_EVENT }
}

export function deleteEventThunkCreator(id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.deleteEvent(id);
            console.log(data);
            dispatch(deleteEventActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getEventByIdActionCreator(data) { //обращение к reducers
    return { type: GET_EVENT_BY_ID, event: data }
}

export function getEventByIdThunkCreator(id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.getEventById(id);
            console.log(data);
            dispatch(getEventByIdActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function editEventStatusActionCreator() { //обращение к reducers
    return { type: EDIT_EVENT_STATUS }
}

export function editEventStatusThunkCreator(id, newStatus) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await administrationApi.editEventStatus(id, newStatus);
            console.log(data);
            dispatch(editEventStatusActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export default administrationReducer;