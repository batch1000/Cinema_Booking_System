import { httpService } from "./httpService";

const ENDPOINT = "seatHolding";

async function getListSeatHolding(showTimeID) {
  return await httpService.get(`${ENDPOINT}/getListSeatHolding/${showTimeID}`);
}


export const seatHoldingService = {
    getListSeatHolding
};
