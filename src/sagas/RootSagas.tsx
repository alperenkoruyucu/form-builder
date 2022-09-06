import {all,fork} from "redux-saga/effects";

import watchUiSaga from "./uiSaga";

export default function* RootSaga(){
    yield all([
        watchUiSaga()
    ]);
}
