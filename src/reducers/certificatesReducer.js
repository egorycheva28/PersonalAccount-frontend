import { certificatesApi } from "../Api/certificatesApi";

const GET_CERTIFICATES = "GET_CERTIFICATES";
const CREATE_CERTIFICATE = "CREATE_CERTIFICATE";

let initialState = {
    certificatesList: []
}

const certificatesReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_CERTIFICATES:
            newState.certificatesList = action.certificatesList;
            return newState;
        case CREATE_CERTIFICATE:
            return newState;
        default:
            return newState;
    }
}

export function getCertificatesActionCreator(data) { //обращение к reducers
    return { type: GET_CERTIFICATES, certificatesList: data }
}

export function getCertificatesThunkCreator(userType, ownerId) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await certificatesApi.getCertificates(userType, ownerId);
            dispatch(getCertificatesActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function createCertificateActionCreator() { //обращение к reducers
    return { type: CREATE_CERTIFICATE }
}

export function createCertificateThunkCreator(type, staffType, userType, educationEntryId, employeePostId, receiveType) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await certificatesApi.createCertificate(type, staffType, userType, educationEntryId, employeePostId, receiveType);
            dispatch(createCertificateActionCreator());

            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export default certificatesReducer;