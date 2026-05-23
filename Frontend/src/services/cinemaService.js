import { httpService } from "./httpService";

const ENDPOINT = "cinema";

async function createCinema(data) {
  return await httpService.post(`${ENDPOINT}/createCinema`, data);
}

async function getListCinema(page, pageSize, filter) {
  return await httpService.get(`${ENDPOINT}/getListCinema`, {
    page,
    pageSize,
    ...filter,
  });
}

async function getAllListCinema() {
  return await httpService.get(`${ENDPOINT}/getAllListCinema`);
}

async function getAllListCinemaShowTime() {
  return await httpService.get(`${ENDPOINT}/getAllListCinemaShowTime`);
}

async function getPaginationInfo(pageSize, filter) {
    return await httpService.get(`${ENDPOINT}/getPaginationInfo`, {
        pageSize,
        ...filter
    });
}

async function updateCinema(id, data) {
  return await httpService.put(`${ENDPOINT}/updateCinema/${id}`, data);
}

async function deleteCinema(id) {
  return await httpService.delete(`${ENDPOINT}/deleteCinema/${id}`);
}

export const cinemaService = {
  createCinema,
  getListCinema,
  updateCinema,
  deleteCinema,
  getPaginationInfo,
  getAllListCinema,
  getAllListCinemaShowTime
};
