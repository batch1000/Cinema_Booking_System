import { httpService } from "./httpService"

const ENDPOINT = 'actor'

async function getListActor() {
    return await httpService.get(`${ENDPOINT}/getListActor`);
}

async function createActor(data) {
    return await httpService.post(`${ENDPOINT}/createActor`, data);
}

async function updateActor(id, data) {
    return await httpService.put(`${ENDPOINT}/updateActor/${id}`, data);
}

async function deleteActor(id) {
    return await httpService.delete(`${ENDPOINT}/deleteActor/${id}`);
}

export const actorService = {
    getListActor,
    createActor,
    updateActor,
    deleteActor
}
