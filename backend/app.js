const express = require("express");
const routes = require("./routes/allRoutes");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PATCH,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

app.listen(8080, () => console.log("Server läuft auf Port 8080"));
