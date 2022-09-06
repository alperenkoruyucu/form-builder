import { authProps, languageProps, themeProps } from "./sagas/types";
import {types} from "./types";


export const changeLanguage = (data: languageProps) => {
    return {
        type: types.CHANGE_LANG,
        payload: data
    }
}

export const updateLanguage = (data: languageProps) => {
    return {
        type: types.UPDATE_LANG,
        payload: data
    }
}

export const changeTheme = (data: themeProps) => {
    return {
        type: types.CHANGE_THEME,
        payload: data
    }
}

export const updateTheme = (data: themeProps) => {
    return {
        type: types.UPDATE_THEME,
        payload: data
    }
}

export const auth = (data: authProps) => {
    return{
        type: types.UPDATE_ACCOUNT,
        payload: data,
    }
}