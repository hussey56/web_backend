const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./db/database");
const { PORT } = require("./config/index");
const cors = require("cors");
const Router = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(Router);
dbConnect();

app.use(errorHandler);
app.listen(PORT, console.log(`Web Server is running on the ${PORT}`));
