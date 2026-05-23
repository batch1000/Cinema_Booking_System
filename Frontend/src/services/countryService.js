import { httpService } from "./httpService"

const ENDPOINT = 'country'

async function getListCountry() {
    return await httpService.get(`${ENDPOINT}/getListCountry`);
}

async function createCountry(data) {
    return await httpService.post(`${ENDPOINT}/createCountry`, data);
}

async function updateCountry(id, data) {
    return await httpService.put(`${ENDPOINT}/updateCountry/${id}`, data);
}

async function deleteCountry(id) {
    return await httpService.delete(`${ENDPOINT}/deleteCountry/${id}`);
}

export const countryService = {
    getListCountry,
    createCountry,
    updateCountry,
    deleteCountry
}
