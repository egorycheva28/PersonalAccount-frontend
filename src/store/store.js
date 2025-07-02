import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import loginReducer from '../reducers/loginReducer';
import profileReducer from '../reducers/profileReducer';
import usefulServiceReducer from '../reducers/usefulServicesReducer';
import certificatesReducer from '../reducers/certificatesReducer';
import administrationReducer from '../reducers/administrationReducer';
import eventsReducer from '../reducers/eventsReducer';

let reducers = combineReducers({
    loginPage: loginReducer,
    profilePage: profileReducer,
    usefulServicesPage: usefulServiceReducer,
    certificatesPage: certificatesReducer,
    administrationPage: administrationReducer,
    eventsPage: eventsReducer
});

let store = createStore(reducers, applyMiddleware(thunk));

export default store;