import { types } from "../types";

const initialState = {    
    language:'en',
    theme: 'light'
};

const uiReducer = (state = initialState, action) => {
    console.log('uireducer',action)
    switch (action.type){
        case types.UPDATE_LANG:
            return{
                ...state,
                language: action.payload
            }
        case types.UPDATE_THEME:
            return{
                ...state,
                theme: action.payload
            }
       default:
        return state     
    }
}

export default uiReducer;