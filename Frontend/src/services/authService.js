import { httpService } from "./httpService"

const ENDPOINT = 'auth'

async function signup(data) {
    return await httpService.post(`${ENDPOINT}/signup`, data);
}

async function login(data) {
    return await httpService.post(`${ENDPOINT}/login`, data);
}


export const authService = {
    signup,
    login
}