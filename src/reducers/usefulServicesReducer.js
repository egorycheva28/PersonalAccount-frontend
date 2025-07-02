import { usefulServicesApi } from "../Api/usefulServicesApi";

const GET_LIST = "GET_LIST";

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
    }
    ,
}

const usefulServiceReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_LIST:
            newState.results = action.results;
            newState.metaData = action.metaData;
            return newState;
        default:
            return newState;
    }
}

export function getUsefulServicesActionCreator(data) { //обращение к reducers
    return { type: GET_LIST, results: data.results, metaData: data.metaData }
}

export function getUsefulServicesThunkCreator(category, page, pageSize) { //обращение к серверу
    return async (dispatch) => {
        try {
            const data = await usefulServicesApi.getUsefulServices(category, page, pageSize);
            console.log(data);
            dispatch(getUsefulServicesActionCreator(data));
            return data;
        }
        catch (error) {
            console.error("Ошибка:", error);
        }
    }
}

export default usefulServiceReducer;