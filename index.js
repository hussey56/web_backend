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
let latestScreen = "hello";

app.post("/show-screen", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).send("Wrong Json Format");
  }
  latestScreen = question;
  console.log(`Request to show screen: ${question}`);
  res.json({ message: `Showing screen: ${question}` });
});

app.get("/get-screen", (req, res) => {
  res.set({
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(`data: ${JSON.stringify({ message: "Connected to SSE" })}\n\n`);

  setInterval(() => {
    const eventData = {
      message: "New event from server",
      timestamp: new Date().toISOString(),
    };
    res.write(`data: ${JSON.stringify(latestScreen)}\n\n`);
  }, 3000);
});
app.listen(7000, console.log(`Web Server is running on the 7000`));
