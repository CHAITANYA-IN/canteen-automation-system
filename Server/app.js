require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const { db, options } = require("./database");
const local = require("./strategies/local");

// Routing imports
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const menuRoute = require("./routes/menu");
const itemsRoute = require("./routes/items");
const ordersRoute = require("./routes/orders");

const app = express();
const store = session.MemoryStore();

// Middlewares
app.use(
  session({
    secret: "canteen",
    cookie: { maxAge: 100000 },
    resave: false,
    saveUninitialized: true,
    store,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/menu", menuRoute);
app.use("/items", itemsRoute);
app.use("/orders", ordersRoute);

// Port Specification
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at Port : http://localhost:${PORT}`);
});
