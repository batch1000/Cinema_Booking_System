import { createConnection } from "./baseHub"

const connect = createConnection("http://localhost:5000/seatHub");

async function start() {
  return await connect.start();
}

async function stop() {
  return await connect.stop();
}

function listenSeatHold(handleListenSeatHold) {
  connect.on("ReceiveSeatHold", handleListenSeatHold);
}

function sendSeatHold(seatHold) {
  return connect.invoke("SendSeatHold", seatHold);
}

function joinGroupShowTime(showTimeID) {
  return connect.invoke("JoinGroup", showTimeID);
}

function leaveGroupShowTime(showTimeID) {
  return connect.invoke("LeaveGroup", showTimeID);
}

export const seatHubService = {
  start,
  stop,
  listenSeatHold,
  sendSeatHold,
  joinGroupShowTime,
  leaveGroupShowTime
};