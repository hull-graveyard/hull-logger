import getShipLog from "./ship-logs";

module.exports = function handle(event, { timestamp, message = {} }, { hull }) {
  try {
    const { id, secret } = hull.configuration() || {};
    if (id && secret) {
      getShipLog(id, secret).push({ timestamp, message, event });
    }
  } catch (err) {
    console.log(err);
  }
  return true;
};
