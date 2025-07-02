import { eventsApi } from "../Api/eventsApi";

const GET_PUBLIC_EVENTS = "GET_PUBLIC_EVENTS";
const GET_AUTH_EVENTS = "GET_AUTH_EVENTS";
const GET_EVENT_BY_ID = "GET_EVENT_BY_ID";
const GET_EVENT_IS_PARTICIPANT = "GET_EVENT_IS_PARTICIPANT";
const REGISTER_INNER = "REGISTER_INNER";
const REGISTER_EXTERNAL = "REGISTER_EXTERNAL";

let initialState = {
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
    event: {},
    isParticipating: ''
}

const eventsReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_PUBLIC_EVENTS:
            newState.results = action.results;
            newState.metaData = action.metaData;
            return newState;
        case GET_AUTH_EVENTS:
            newState.results = action.results;
            newState.metaData = action.metaData;
            return newState;
        case GET_EVENT_BY_ID:
            newState.event = action.event;
            return newState;
        case GET_EVENT_IS_PARTICIPANT:
            newState.isParticipating = action.isParticipating;
            return newState;
        case REGISTER_INNER:
            return newState;
        case REGISTER_EXTERNAL:
            return newState;
        default:
            return newState;
    }
}

export function getPublicEventsActionCreator(data) { //обращение к reducers
    return { type: GET_PUBLIC_EVENTS, results: data.results, metaData: data.metaData }
}

export function getPublicEventsThunkCreator(name, eventDate, timezoneOffset, page, pageSize) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await eventsApi.getPublicEvents(name, eventDate, timezoneOffset, page, pageSize);
            console.log(data);
            dispatch(getPublicEventsActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getAuthEventsActionCreator(data) { //обращение к reducers
    return { type: GET_AUTH_EVENTS, results: data.results, metaData: data.metaData }
}

export function getAuthEventsThunkCreator(name, eventDate, timezoneOffset, page, pageSize) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await eventsApi.getAuthEvents(name, eventDate, timezoneOffset, page, pageSize);
            console.log(data);
            dispatch(getAuthEventsActionCreator(data));
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
            const data = await eventsApi.getEventById(id);
            console.log(data);
            dispatch(getEventByIdActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getEventIsParticipantActionCreator(data) { //обращение к reducers
    return { type: GET_EVENT_IS_PARTICIPANT, isParticipating: data.isParticipating }
}

export function getEventIsParticipantThunkCreator(id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await eventsApi.getEventIsParticipant(id);
            console.log(data.isParticipating);
            dispatch(getEventIsParticipantActionCreator(data));
            return data.isParticipating;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function registerInnerParticipantActionCreator() { //обращение к reducers
    return { type: REGISTER_INNER }
}

export function registerInnerParticipantThunkCreator(id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await eventsApi.registerInnerParticipant(id);
            console.log(data);
            dispatch(registerInnerParticipantActionCreator());
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function registerExternalParticipantActionCreator() { //обращение к reducers
    return { type: REGISTER_EXTERNAL }
}

export function registerExternalParticipantThunkCreator(id, name, email, phone, additionalInfo) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await eventsApi.registerExternalParticipant(id, name, email, phone, additionalInfo);
            console.log(data);
            dispatch(registerExternalParticipantActionCreator());
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export default eventsReducer;