import { httpService } from "./httpService"

const ENDPOINT = 'movie'

async function createMovie(data) {
    return await httpService.post(`${ENDPOINT}/createMovie`, data);
}

async function updateMovie(id, data) {
    return await httpService.post(`${ENDPOINT}/updateMovie/${id}`, data);
}

async function getListMovie(page, pageSize, filter) {
    return await httpService.get(`${ENDPOINT}/getListMovie`, {
        page,
        pageSize,
        ...filter
    });
}

async function getMovieInfoPagination(pageSize, filter) {
    return await httpService.get(`${ENDPOINT}/getMovieInfoPagination`, {
        pageSize,
        ...filter
    });
}

async function getAllListMovie() {
    return await httpService.get(`${ENDPOINT}/getAllListMovie`);
}

async function getMovieById(id) {
    return await httpService.get(`${ENDPOINT}/getMovieById/${id}`);
}

async function deleteMovie(id) {
    return await httpService.delete(`${ENDPOINT}/deleteMovie/${id}`);
}

async function importMovieApi(data) {
    return await httpService.post(`${ENDPOINT}/importMovieApi`, data);
}

async function getListMovieBanner(page, pageSize, filter) {
    return await httpService.get(`${ENDPOINT}/getListMovieBanner`, {
        page,
        pageSize,
        ...filter
    });
}

async function getListMovieByCountry(page, pageSize, filter) {
    return await httpService.get(`${ENDPOINT}/getListMovieByCountry`, {
        page,
        pageSize,
        ...filter
    });
}

async function getListMovieByGenre(page, pageSize, filter) {
    return await httpService.get(`${ENDPOINT}/getListMovieByGenre`, {
        page,
        pageSize,
        ...filter
    });
}

export const movieService = {
    createMovie,
    getListMovie,
    updateMovie,
    deleteMovie,
    importMovieApi,
    getMovieInfoPagination,
    getMovieById,
    getAllListMovie,
    getListMovieBanner,
    getListMovieByCountry,
    getListMovieByGenre
}