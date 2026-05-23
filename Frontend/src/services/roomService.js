import { httpService } from "./httpService"

const ENDPOINT = 'room'

async function createRoom(data) {
    return await httpService.post(`${ENDPOINT}/createRoom`, data);
}

async function getListRoom() {
    return await httpService.get(`${ENDPOINT}/getListRoom`);
}

async function updateRoom(id, data) {
    return await httpService.put(`${ENDPOINT}/updateRoom/${id}`, data);
}

async function deleteRoom(id) {
    return await httpService.delete(`${ENDPOINT}/deleteRoom/${id}`);
}

export const roomService = {
    createRoom,
    getListRoom,
    updateRoom,
    deleteRoom
}
