const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use("/api", router); // All APIs prefixed with /api

server.listen(process.env.PORT || 3001, () => {
  console.log("JSON Server is running");
});
