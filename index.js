const express = require("express");
const session = require("express-session");
const cors = require("cors");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const errorHandler = require("./Middlewares/ErrorHandler");

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({
  origin: [
    'https://admin-amber-three.vercel.app/',
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
  ], 
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
const routes = require("./Routes/Server");
app.use("/api", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 📡🌎`);
});

const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
