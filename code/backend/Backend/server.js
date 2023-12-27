const express = require("express");
const errorHandler = require("./middleware/errorhandler.js");
const dotenv = require("dotenv").config();
const connectDb = require('./config/dbConnection');

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/beehive", require("./routes/beehiveRoute.js"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
