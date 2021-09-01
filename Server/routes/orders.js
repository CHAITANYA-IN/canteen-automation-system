const { Router } = require("express");
// const { db} = require("database");
const Rpay = require("razorpay");
const { db } = require("../database");
const crypto = require("crypto");
const shortid = require("shortid");
const otpGenerator = require("otp-generator");

const authenticator = require("../middlewares");

const router = Router();
const razorpay = new Rpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
router.post("/", [authenticator /*, orderSchema*/], async (req, res) => {
  try {
    const cart = req.body;
    console.log("Cart=", cart);
    const { items } = cart;
    let itemsQuery = `INSERT INTO live_ordered_items VALUES`;

    const payment_capture = 1;
    const currency = "INR";
    const amount = cart.bill * 100;

    await razorpay.orders
      .create({
        amount: amount,
        currency,
        receipt: shortid.generate(),
        payment_capture,
      })
      .then(async (order) => {
        console.log("Order=", order);
        query = `INSERT INTO live_orders 
          VALUES('${order.id}', ${req.user.customer_id}, ${cart.bill}, 
          1, NOW(), null, '${cart.suggestion}', 
          ${cart.paymentmode}, null);`;
        console.log("Query=", query);
        const resultOrder = await db.promise().query(query); // Pushing the order details except the transaction id
        items.forEach((item, index) => {
          itemsQuery += `('${order.id}', ${item.item_id}, ${item.price}, ${item.quantity})`;
          itemsQuery += index != items.length - 1 ? ", " : ";";
        });
        console.log("Item query=", itemsQuery);
        const resultItems = await db.promise().query(itemsQuery); // Pushing the ordered items
        res.status(200).json({
          amount: order.amount,
          id: order.id,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    console.log(err);
    throw err;
  }
});

router.get("/:type", authenticator, async (req, res) => {
  if (req.params.type !== "past" && req.params.type !== "live") {
    res.status(400).json({ message: "Invalid Order type" });
  }
  console.log(req.params.type);
  results = await db
    .promise()
    .query(
      `SELECT * FROM ${req.params.type}_orders WHERE customer_id=${req.user.customer_id};`
    );

  results[0].length == 0
    ? res.status(200).json({ message: "No orders yet" })
    : res.status(200).json(results[0]);
}); // get all Orders

router.get("/:type/:id", authenticator, async (req, res) => {
  if (req.params.type !== "past" && req.params.type !== "live") {
    res.status(400).json({ message: "Invalid Order type" });
  }
  results = await db
    .promise()
    .query(
      `SELECT * FROM ${req.params.type}_orders WHERE order_id=${req.params.id};`
    );
  if (results[0].length == 0)
    res.status(400).json({ message: "Bad Request, no such order found" });
  else {
    res.status(200).json(results[0]);
  }
}); // get a specific order

router.get("/:type/:id/items", authenticator, async (req, res) => {
  if (req.params.type !== "past" && req.params.type !== "live") {
    res.status(400).json({ message: "Invalid Order type" });
  }
  results = await db
    .promise()
    .query(
      `SELECT * FROM ${req.params.type}_ordered_items WHERE order_id=${req.params.id};`
    );
  if (results[0].length == 0) res.status(400).json({ message: "Bad Request" });
  else {
    res.status(200).json(results[0]);
  }
}); // get items from that order

router.get("/:type/:id/items/:itemID", authenticator, async (req, res) => {
  if (req.params.type !== "past" && req.params.type !== "live") {
    res.status(400).json({ message: "Invalid Order type" });
  }
  results = await db.promise().query(
    `SELECT p.quantity, p.price, items.item_id, items.image, items.name, items.description 
      FROM ${req.params.type}_ordered_items as p, items 
      WHERE items.item_id =p.item_id AND p.order_id = ${req.params.id} AND items.item_id = ${req.params.itemID};`
  );
  if (results[0].length == 0) res.status(400).json({ message: "Bad Request" });
  else {
    res.status(200).json(results[0]);
  }
}); // get a specific item from the order

module.exports = router;
