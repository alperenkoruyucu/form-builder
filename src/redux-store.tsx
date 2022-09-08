import {createStore, applyMiddleware} from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from "redux-saga";
import RootReducer from "./reducers/RootReducer";
import RootSaga from "./sagas/RootSagas";

const persistConfig = {
    key: 'root',
    storage,
  }
   
const persistedReducer = persistReducer(persistConfig, RootReducer)
const sagaMiddleware = createSagaMiddleware();
const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(RootSaga);

const persistor = persistStore(store)
export default store;
export {persistor}