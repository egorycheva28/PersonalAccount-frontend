import { profileApi } from "../Api/profileApi";

const GET_PROFILE = "GET_PROFILE";
const GET_STUDENT = "GET_STUDENT";
const GET_EMPLOYEE = "GET_EMPLOYEE";
const GET_AVATAR = "GET_AVATAR";
const EDIT_AVATAR = "EDIT_AVATAR";

let initialState = {
    profile: {
        id: '',
        email: '',
        lastName: '',
        firstName: '',
        patronymic: '',
        birthday: '',
        gender: '',
        avatar: '',
        citizenship: {
            code: '',
            id: '',
            name: ''
        },
        address: '',
        contacts: [],
        userTypes: []
    },
    student: {
        id: '',
        educationEntries: [
            {
                id: '',
                faculty: {
                    id: '',
                    name: ''
                },
                group: {
                    id: '',
                    name: ''
                },
                educationStatus: {
                    id: '',
                    name: ''
                },
                educationBase: {
                    id: '',
                    name: ''
                },
                educationDirection: {
                    id: '',
                    name: ''
                },
                educationProfile: {
                    id: '',
                    name: ''
                },
                educationQualification: {
                    id: '',
                    name: ''
                },
                educationLevel: {
                    id: '',
                    name: ''
                },
                educationForm: {
                    id: '',
                    name: ''
                },
                educationYears: {
                    id: '',
                    name: ''
                },
                creditBooknumber: '',
                course: '',
                admissionYear: ''
            }
        ]
    },
    employee: {
        id: '',
        experience: [{
            id: '',
            years: '',
            months: '',
            type: ''
        }],
        posts: [{
            id: '',
            rate: '',
            departments: [{
                parentId: '',
                email: '',
                id: '',
                name: ''
            }],
            postType: {
                id: '',
                name: ''
            },
            postName: {
                id: '',
                name: ''
            },
            dateStart: '',
            dateEnd: '',
            employmentType: ''
        }]
    },
    avatar: ''
}

const profileReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_PROFILE:
            newState.profile = action.profile;
            return newState;
        case GET_STUDENT:
            newState.student = action.student;
            return newState;
        case GET_EMPLOYEE:
            newState.employee = action.employee;
            return newState;
        case GET_AVATAR:
            newState.avatar = action.avatar;
            return newState;
        case EDIT_AVATAR:
            return newState;
        default:
            return newState;
    }
}

export function getProfileActionCreator(data) { //обращение к reducers
    return { type: GET_PROFILE, profile: data }
}

export function getProfileThunkCreator() { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await profileApi.getProfile();
            console.log(data);
            dispatch(getProfileActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getProfileStudentActionCreator(data) { //обращение к reducers
    return { type: GET_STUDENT, student: data }
}

export function getProfileStudentThunkCreator() { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await profileApi.getProfileStudent();
            console.log(data);
            dispatch(getProfileStudentActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function getProfileEmployeeActionCreator(data) { //обращение к reducers
    return { type: GET_EMPLOYEE, employee: data }
}

export function getProfileEmployeeThunkCreator() { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await profileApi.getProfileEmployee();
            console.log(data);
            dispatch(getProfileEmployeeActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export function editAvatarActionCreator() { //обращение к reducers
    return { type: EDIT_AVATAR }
}

export function editAvatarThunkCreator(id) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await profileApi.editAvatar(id);
            console.log(data);
            dispatch(editAvatarActionCreator());
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export default profileReducer;