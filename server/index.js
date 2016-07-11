import Hull from "hull";
import Server from "./server";


Hull.onLog(function onLog(message, data, ctx = {}) {
  console.log(`[${ctx.id}] logger.${message}`, JSON.stringify(data || ""));
});
Hull.onMetric(function onMetric(metric, value, ctx = {}) {
  console.log(`[${ctx.id}] logger.${metric}`, value);
});

Server({
  Hull,
  hostSecret: process.env.SECRET || "1234",
  devMode: process.env.NODE_ENV === "development",
  port: process.env.PORT || 8082
});
