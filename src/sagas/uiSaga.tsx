import { put, takeEvery, takeLatest } from "redux-saga/effects";
import { types } from "../types";
import {changeLanguage, updateLanguage, updateTheme} from "../actions";


function* setLang (data: any)
{    
    yield put(updateLanguage(data.payload))    
}
function* setTheme(data: any)
{
    yield put(updateTheme(data.payload))
}
function* watchUiSaga(){    
    yield takeLatest(types.CHANGE_LANG, setLang)
    yield takeLatest(types.CHANGE_THEME, setTheme)    
}

export default watchUiSaga