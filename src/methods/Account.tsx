import { loginProps} from "../sagas/types"

const axios = require('axios')

const HTTP = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})


export const Login = (data:loginProps) => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/login', data)
            .then((res:any) => {
                resolve(res)})
            .catch((err:any) => {console.log(err);reject(err)})
    })
}

export const RegisterAsAdmin = (data:any) => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/register-as-admin', data, {
            headers: { 'x-access-token': localStorage.getItem('jwt') },
        })
            .then((res:any) => {
                console.log(res)
                resolve(res)})
            .catch((err:any) => reject(err))
    })
}

export const isExpired = () => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/is-expired', { token: localStorage.getItem('jwt') })
            .then((res:any) => {
                resolve(res.data)
            })
            .catch((err:any) => {
                console.log(err)
                reject(err)
            })
    })
}

export const getRole = () => {
    return new Promise((resolve, reject) => {
        HTTP.post('/api/account/get-role', { token: localStorage.getItem('jwt') })
            .then((res:any) => resolve(res.data))
            .catch((err:any) => {
                console.log(err)
                reject(err)
            })
    })
}
