import { httpService } from "./httpService"

const ENDPOINT = 'seatType'

async function createSeatType(data) {
    return await httpService.post(`${ENDPOINT}/createSeatType`, data);
}

async function getListSeatType() {
    return await httpService.get(`${ENDPOINT}/getListSeatType`);
}

async function updateSeatType(id, data) {
    return await httpService.put(`${ENDPOINT}/updateSeatType/${id}`, data);
}

async function deleteSeatType(id) {
    return await httpService.delete(`${ENDPOINT}/deleteSeatType/${id}`);
}

export const seatTypeService = {
    createSeatType,
    getListSeatType,
    updateSeatType,
    deleteSeatType
}
