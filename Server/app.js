require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Routing imports
const usersRoute = require("./routes/users");
const menuRoute = require("./routes/menu");
const itemsRoute = require("./routes/items");
const ordersRoute = require("./routes/orders");

const app = express();

// Middlewares
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", usersRoute);
app.use("/menu", menuRoute);
app.use("/items", itemsRoute);
app.use("/orders", ordersRoute);

// Port Specification
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at Port : http://localhost:${PORT}`);
});

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Good to go",
    authentication: `Login on port ${process.env.AUTH_PORT}`,
  });
});
