import { httpService } from "./httpService";

const ENDPOINT = "showTime";

async function createShowTime(data) {
  return await httpService.post(`${ENDPOINT}/createShowTime`, data);
}

async function getListShowTime(page, pageSize, filter) {
  return await httpService.get(`${ENDPOINT}/getListShowTime`, {
    page,
    pageSize,
    ...filter,
  });
}

async function getPaginationInfo(pageSize, filter) {
    return await httpService.get(`${ENDPOINT}/getPaginationInfo`, {
        pageSize,
        ...filter
    });
}

async function updateShowTime(id, data) {
  return await httpService.put(`${ENDPOINT}/updateShowTime/${id}`, data);
}

async function deleteShowTime(id) {
  return await httpService.delete(`${ENDPOINT}/deleteShowTime/${id}`);
}

async function getListShowTimeByMovie(id, filter) {
  return await httpService.get(`${ENDPOINT}/getListShowTimeByMovie/${id}`,{
    ...filter
  });
}

async function getListGroupByShowTimeByMovie(id) {
  return await httpService.get(`${ENDPOINT}/getListGroupByShowTimeByMovie/${id}`);
}


export const showTimeService = {
  createShowTime,
  getListShowTime,
  updateShowTime,
  deleteShowTime,
  getPaginationInfo,
  getListShowTimeByMovie,
  getListGroupByShowTimeByMovie
};
