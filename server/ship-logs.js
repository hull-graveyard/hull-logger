import TCA from "tailable-capped-array";

const logs = {};
const emptyTCA = new TCA(1);

module.exports = function shipLogs(id = "", secret = "") {
  if (!id || !secret) return emptyTCA;
  const k = `${id}-${secret}`;
  const shipLog = logs[k] || new TCA(100);
  logs[k] = shipLog;
  return shipLog;
};
