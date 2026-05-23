import { httpService } from "./httpService"

const ENDPOINT = 'genre'

async function getListGenre() {
    return await httpService.get(`${ENDPOINT}/getListGenre`);
}

async function createGenre(data) {
    return await httpService.post(`${ENDPOINT}/createGenre`, data);
}

async function updateGenre(id, data) {
    return await httpService.put(`${ENDPOINT}/updateGenre/${id}`, data);
}

async function deleteGenre(id) {
    return await httpService.delete(`${ENDPOINT}/deleteGenre/${id}`);
}

export const genreService = {
    createGenre,
    getListGenre,
    updateGenre,
    deleteGenre
}
