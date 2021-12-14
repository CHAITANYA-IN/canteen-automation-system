const { Router } = require("express");
const { db } = require("../database/database");
const Rpay = require("razorpay");

const crypto = require("crypto");
const shortid = require("shortid");
const otpGenerator = require("otp-generator");
// const bodyParser = require("body-parser");

const { authenticator } = require("../services/middlewares");
const { orderSchema } = require("../services/validator");

const router = Router();

const razorpay = new Rpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/", [authenticator /*, orderSchema*/], async (req, res) => {
  try {
    const cart = req.body;
    const { items } = cart;
    let itemsQuery = `INSERT INTO live_ordered_items VALUES`;

    const payment_capture = 1;
    const currency = "INR";
    const amount = cart.bill * 100;

    await razorpay.orders
      .create({
        amount: amount.toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture,
      })
      .then(async (order) => {
        console.log(order);
        const resultOrder = await db.promise().query(
          `INSERT INTO live_orders 
            VALUES('${order.id}', ${req.user.customer_id}, ${cart.bill}, 
            1, NOW(), null, '${cart.suggestion}', 
            ${cart.paymentmode}, null);`
        ); // Pushing the order details except the transaction id

        items.forEach((item, index) => {
          itemsQuery += `('${order.id}', ${item.item_id}, ${item.price}, ${item.quantity})`;
          itemsQuery += index != items.length - 1 ? ", " : ";";
        });
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

router.post("/payment", async (req, res) => {
  const secret = process.env.RAZORPAY_HOOK_SECRET;
  const otp = otpGenerator.generate(6);

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Success");
    if (
      req.body.event === "payment.captured" &&
      req.body.payload.payment.entity.captured
    ) {
      updateResult = await db.promise().query(
        `UPDATE live_orders 
          SET order_status=2, otp='${otp}', 
          transaction_id='${req.body.payload.payment.entity.id}' 
          WHERE order_id='${req.body.payload.order.id}'`
      );
      insertResult = await db.promise().query(
        `INSERT INTO transactions 
          VALUES ('${req.body.payload.payment.entity.id}', 
          '${req.body.payload.payment.order_id}', 
          '${req.body.payload.payment.entity.bank} - ${req.body.payload.payment.entity.acquirer_data.bank_transaction_id}', 
          '${req.body.payload.order.receipt}');`
      );
    } else {
      console.log({
        error_code: req.body.payload.payment.entity.error_code,
        error_description: req.body.payload.payment.entity.error_description,
        error_source: req.body.payload.payment.entity.error_source,
        error_step: req.body.payload.payment.entity.error_step,
        error_reason: req.body.payload.payment.entity.error_reason,
      });
    }
    res.sendStatus(200);
  } else {
    console.log("Failure");
    res.sendStatus(502);
  }
});

router.post("/deliever", async (req, res) => {
  results = await db.promise().query(
    `SELECT * from live_orders
      WHERE customer_id='${req.body.customer}'
      AND order_id='${req.body.order}';`
  );
  console.log(results);
  if (req.body.otp === results[0].otp) {
    movedOrderResults = await db.promise().query(`
    INSERT INTO past_orders 
    VALUES('${results[0].order_id}', ${results[0].customer_id}
    , ${results[0].bill}, 3, '${results[0].placing_time}'
    , '${results[0].completion_time}', '${results[0].suggestion}'
    , ${results[0].payment}, '${results[0].transaction_id}'
  );`);

    items = await db
      .promise()
      .query(
        `SELECT * FROM live_ordered_items WHERE order_id=${req.body.order}`
      );

    itemsQuery = `INSERT INTO past_ordered_items VALUES`;
    items[0].forEach((item, index) => {
      itemsQuery += `('${order.id}', ${item.id}, ${item.price}, ${item.quantity})`;
      itemsQuery += index != items.length - 1 ? ", " : ";";
    });

    movedItemsResults = await db.promise().query(itemsQuery);

    res.status(200).json({
      message: "Customer Verified, deliever the order",
    });
  } else {
    res.status(404).json({ message: "Order not found" });
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

router.delete("/:id", [authenticator], async (req, res) => {
  try {
    results = await db
      .promise()
      .query(
        `DELETE FROM live_orders WHERE customer_id = ${req.user.customer_id} AND order_id=${req.params.id};`
      );
    console.log(results);
    if (results[0].affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json({ message: "Deleted" });
    }
  } catch (err) {
    await db.rollback();
    throw err;
  }
});

module.exports = router;
