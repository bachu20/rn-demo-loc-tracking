require("./db").start();

const express = require("express");
const cors = require("cors");
const middleware = require("./middleware/index");
const routes = require("./routes");

const app = express();

const API_PREFIX = "/api/v0";

app.use(cors());

app.use(express.json());

const noAuthRoutes = express.Router();
for (const r in routes) {
  if (routes[r].skipAuth) {
    routes[r].load(noAuthRoutes);
  }
}

console.log("attach unauthenticated routes");
app.use(API_PREFIX, noAuthRoutes);

// require auth for all non-login routes
app.use(middleware.authentication);

const authRoutes = express.Router();
for (const r in routes) {
  if (!routes[r].skipAuth) {
    routes[r].load(authRoutes);
  }
}

console.log("attach authenticated routes");
app.use(API_PREFIX, authRoutes);

// error handling middleware
app.use(middleware.errorHandler());

app.listen(3000, () => console.log("listening on port 3000"));
