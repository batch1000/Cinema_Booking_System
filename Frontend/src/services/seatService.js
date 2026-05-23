import { httpService } from "./httpService"

const ENDPOINT = 'seat'

async function updateListSeat(data) {
    return await httpService.put(`${ENDPOINT}/updateListSeat`, data);
}


export const seatService = {
    updateListSeat
}
