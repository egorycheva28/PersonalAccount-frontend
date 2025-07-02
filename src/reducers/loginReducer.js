import { userApi } from "../Api/loginApi";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

let initialState = {
    token: ''
}

const loginReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case LOGIN:
            newState.token = action.token;
            return newState;

        case LOGOUT:
            return newState;
        default:
            return newState;
    }
}

export function loginActionCreator(data) { //обращение к reducers
    return { type: LOGIN, token: data.accessToken }
}

export function loginThunkCreator(email, password, rememberMe) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await userApi.loginUser(email, password, rememberMe);
            if (data.loginSucceeded == false) {
                return;
            }
            dispatch(loginActionCreator(data));

            localStorage.setItem('token', `${data.accessToken}`);
            localStorage.setItem('refreshToken', `${data.refreshToken}`);

            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function logoutActionCreator() { //обращение к reducers
    return { type: LOGOUT }
}

export function logoutThunkCreator() { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await userApi.logoutUser();
            dispatch(logoutActionCreator());

            if (data.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('roles');
                return;
            }
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export default loginReducer;