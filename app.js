var cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;

const db = require("./configs/db");
const router = require("./routes");

app.use(cors());
// connect to DB
db.connect();

// Middleware
app.use(express.json());

// Đăng ký route
app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
