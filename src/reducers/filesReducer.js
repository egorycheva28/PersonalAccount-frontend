import { filesApi } from "../Api/filesApi";

const GET_FILE = "GET_FILE";
const GET_TEXT_FILE = "GET_TEXT_FILE";
const ADD_FILE = "ADD_FILE";

let initialState = {
}

const filesReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_FILE:
            return newState;
        case GET_TEXT_FILE:
            return newState;
        case ADD_FILE:
            return newState;
        default:
            return newState;
    }
}

export function getFileActionCreator() { //обращение к reducers
    return { type: GET_FILE }
}

export function getFileThunkCreator(id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await filesApi.getFile(id);
            dispatch(getFileActionCreator(data));

            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getTextFileActionCreator() { //обращение к reducers
    return { type: GET_TEXT_FILE }
}

export function getTextFileThunkCreator(id, nameFile) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await filesApi.getTextFile(id, nameFile);

            dispatch(getTextFileActionCreator(data));

            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function addFileActionCreator() { //обращение к reducers
    return { type: ADD_FILE }
}

export function addFileThunkCreator(file) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await filesApi.addFile(file);
            dispatch(addFileActionCreator());
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export default filesReducer;