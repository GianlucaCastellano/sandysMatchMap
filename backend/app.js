const express = require("express");
const routes = require("./routes/allRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server Error" });
});

app.listen(8080, () => console.log("Server läuft auf Port 8080"));
