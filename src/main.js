const OGImageServer = require("./OGImageServer");
const mdem = require("markdown-express-middleware");

const { PORT } = process.env;

const ogImageServer = new OGImageServer({ port: PORT });
ogImageServer.app.use("/", mdem("README.md", { title: "og" }));
ogImageServer.start();

process.on("uncaughtException", err => {
  console.error(err.stack || err);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error(err.stack || err);
  process.exit(1);
});
