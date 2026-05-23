import { httpService } from "./httpService"

const ENDPOINT = 'director'

async function getListDirector() {
    return await httpService.get(`${ENDPOINT}/getListDirector`);
}

async function createDirector(data) {
    return await httpService.post(`${ENDPOINT}/createDirector`, data);
}

async function updateDirector(id, data) {
    return await httpService.put(`${ENDPOINT}/updateDirector/${id}`, data);
}

async function deleteDirector(id) {
    return await httpService.delete(`${ENDPOINT}/deleteDirector/${id}`);
}

export const directorService = {
    getListDirector,
    createDirector,
    updateDirector,
    deleteDirector
}
