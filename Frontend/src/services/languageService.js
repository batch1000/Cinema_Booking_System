import { httpService } from "./httpService"

const ENDPOINT = 'language'

async function getListLanguage() {
    return await httpService.get(`${ENDPOINT}/getListLanguage`);
}

async function createLanguage(data) {
    return await httpService.post(`${ENDPOINT}/createLanguage`, data);
}

async function updateLanguage(id, data) {
    return await httpService.put(`${ENDPOINT}/updateLanguage/${id}`, data);
}

async function deleteLanguage(id) {
    return await httpService.delete(`${ENDPOINT}/deleteLanguage/${id}`);
}

export const languageService = {
    getListLanguage,
    createLanguage,
    updateLanguage,
    deleteLanguage
}
