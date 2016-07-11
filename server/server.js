import express from "express";
import path from "path";
import responseTime from "response-time";
import sse from "connect-sse";
import devMode from "./dev-mode";
import logger from "./logger";
import getShipLog from "./ship-logs";


module.exports = function Server(options = {}) {
  const { port, Hull, devMode: dev } = options;
  const { NotifHandler, Routes } = Hull;
  const { Readme, Manifest } = Routes;

  const app = express();

  if (dev) app.use(devMode());

  app.use(responseTime());
  app.use(express.static(path.resolve(__dirname, "..", "dist")));
  app.use(express.static(path.resolve(__dirname, "..", "assets")));

  app.set("views", path.resolve(__dirname, "..", "views"));

  app.get("/manifest.json", Manifest(__dirname));
  app.get("/", Readme);
  app.get("/readme", Readme);


  // app.post("/compute", ComputeHandler({ hostSecret, hullClient, Hull }));
  app.post("/notify", NotifHandler({
    handlers: {
      "user:update": logger.bind(undefined, "user:update"),
      "user:create": logger.bind(undefined, "user:create"),
      "user:delete": logger.bind(undefined, "user:delete"),
      "segment:update": logger.bind(undefined, "segment:update")
    }
  }));

  // Error Handler
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err) {
      const data = {
        status: err.status,
        segmentBody: req.segment,
        method: req.method,
        headers: req.headers,
        url: req.url,
        params: req.params
      };
      console.log("Error ----------------", err.message, err.status, data);
    }

    return res.status(err.status || 500).send({ message: err.message });
  });


  app.get("/events/:id/:secret", sse(), (req, res) => {
    getShipLog(req.params.id, req.params.secret)
    .createReadStream()
    .on("data", res.json);
  });

  app.listen(port);

  return app;
};
