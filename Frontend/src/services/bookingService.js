import { httpService } from "./httpService";

const ENDPOINT = "booking";

async function createBookingDraft(data) {
  return await httpService.post(`${ENDPOINT}/createBookingDraft`, data);
}

async function getBookingDraft(data) {
  return await httpService.get(`${ENDPOINT}/getBookingDraft`, {
    ...data,
  });
}

async function deleteBookingDraft(bookingDraftID, showTimeID, userID) { 
  return await httpService.delete(
    `${ENDPOINT}/deleteBookingDraft/${bookingDraftID}/${showTimeID}/${userID}`
  );
}

async function createPaymentIntent(data) {
  return await httpService.post(`${ENDPOINT}/createPaymentIntent`, data);
}

async function checkBookingDraftExist(data) {
  return await httpService.post(`${ENDPOINT}/checkBookingDraftExist`, data);
}

async function confirmPayment(data) {
  return await httpService.post(`${ENDPOINT}/confirmPayment`, data);
}

async function refreshTimeToLiveBooking(data) {
  return await httpService.post(`${ENDPOINT}/refreshTimeToLiveBooking`, data);
}

async function getListBooking(page, pageSize, filter) {
  return await httpService.get(`${ENDPOINT}/getListBooking`, {
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

async function getListBookedSeat(showTimeID) {
  return await httpService.get(`${ENDPOINT}/getListBookedSeat/${showTimeID}`);
}

export const bookingService = {
  createBookingDraft,
  getBookingDraft,
  deleteBookingDraft,
  createPaymentIntent,
  checkBookingDraftExist,
  confirmPayment,
  refreshTimeToLiveBooking,
  getListBooking,
  getPaginationInfo,
  getListBookedSeat
};
