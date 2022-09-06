import {combineReducers} from "redux";
import authreducer from "./AuthReducer";
import uiReducer from "./uiReducer";
const RootReducer = combineReducers({
    ui:uiReducer, auth:authreducer,
});

export default RootReducer;