const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server Error" });
});

app.listen(8080, (error) => {
  if (error) console.log("Error in Server Setup");
});
