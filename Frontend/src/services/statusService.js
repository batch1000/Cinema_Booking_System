import { httpService } from "./httpService"

const ENDPOINT = 'status'

async function getListStatus() {
    return await httpService.get(`${ENDPOINT}/getListStatus`);
}

async function createStatus(data) {
    return await httpService.post(`${ENDPOINT}/createStatus`, data);
}

async function updateStatus(id, data) {
    return await httpService.put(`${ENDPOINT}/updateStatus/${id}`, data);
}

async function deleteStatus(id) {
    return await httpService.delete(`${ENDPOINT}/deleteStatus/${id}`);
}

export const statusService = {
    getListStatus,
    createStatus,
    updateStatus,
    deleteStatus
}
