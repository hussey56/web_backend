const express = require("express");
const cors = require("cors");
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

app.use(express.json({ limit: "50mb" }));

app.get("/check", (req, res) => {
  res.send("Working Sir");
});
let latestScreen = null; // Variable to store the requested screen

app.post("/show-screen", (req, res) => {
    const { screen } = req.body;
    latestScreen = screen;
    res.json({ message: `Showing screen: ${screen}` });
});

app.get("/get-screen", (req, res) => {
    res.json({ screen: latestScreen });
    latestScreen = null; // Reset after sending
});

app.listen(7000, console.log(`Web Server is running on the 7000`));
