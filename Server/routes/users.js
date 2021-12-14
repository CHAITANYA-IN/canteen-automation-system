const { Router } = require("express");
const { checkSchema } = require("express-validator");

const { db } = require("../database/database");
const { SendMail } = require("../services/mail");
const { authenticator, validate } = require("../services/middlewares");
const {
  userPostSchema,
  userPutSchema,
  verifyMailSchema,
} = require("../services/validator");

const router = Router();

router.get("/details", authenticator, async (req, res) => {
  try {
    results = await db
      .promise()
      .query(
        `SELECT * FROM customer WHERE customer_id=${req.user.customer_id};`
      );
    console.log(results);
    results[0][0].length == 0
      ? res.sendStatus(404).json({ message: "No such customer" })
      : res.status(200).json(results[0][0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}); // Get user details

router.get("/", async (req, res) => {
  try {
    results = await db.promise().query("SELECT * FROM customer;");
    results[0].length == 0
      ? res.status(200).json({ message: "No users added" })
      : res.json(results[0]).status(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}); // Get all Users

router.get("/:id", async (req, res) => {
  results = await db
    .promise()
    .query(`SELECT * FROM customer WHERE customer_id = ${req.params.id};`);
  if (results[0].length == 0) res.sendStatus(404);
  else res.status(200).json(results[0]);
}); // Get details of a specific user

router.get("/:id/orders", async (req, res) => {
  pastResults = await db
    .promise()
    .query(`SELECT * FROM past_orders WHERE customer_id = ${req.params.id};`);
  liveResults = await db
    .promise()
    .query(`SELECT * FROM live_orders WHERE customer_id = ${req.params.id};`);
  if (liveResults[0].length === 0 || pastResults[0].length === 0)
    res.sendStatus(404);
  else {
    res.status(200).json(liveResults[0].concat(pastResults[0]));
  }
}); // Get all orders by specified user

router.get("/:id/orders/:type", async (req, res) => {
  results = await db
    .promise()
    .query(
      `SELECT * FROM ${req.params.type}_orders WHERE customer_id = ${req.params.id};`
    );
  if (results[0].length === 0) res.sendStatus(404);
  else res.status(200).json(results[0]);
}); // Get all type of orders by specified user

router.get("/:id/orders/:orderID", async (req, res) => {
  pastResults = await db
    .promise()
    .query(
      `SELECT * FROM past_orders WHERE customer_id = ${req.params.id} AND order_id = ${req.params.orderID};`
    );
  liveResults = await db
    .promise()
    .query(
      `SELECT * FROM live_orders WHERE customer_id = ${req.params.id} AND order_id = ${req.params.orderID};`
    );
  if (liveResults[0].length === 0 || pastResults[0].length === 0)
    res.sendStatus(404);
  else {
    res.status(200).json(liveResults[0].concat(pastResults[0]));
  }
}); // Get details of an order by the specified user and specified type.

router.get("/:id/orders/:type/:orderID", async (req, res) => {
  results = await db
    .promise()
    .query(
      `SELECT * FROM ${req.params.type}_orders WHERE customer_id = ${req.params.id} AND order_id = ${req.params.orderID};`
    );
  if (results[0].length === 0) res.sendStatus(404);
  else res.status(200).json(results[0]);
}); // Get details of an order by the specified user and specified type.

router.delete("/:id", async (req, res) => {
  try {
    console.log("Deleting");
    results = await db
      .promise()
      .query(`DELETE FROM customer WHERE customer_id=${req.params.id};`);
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
}); // Delete the specified user

router.put(
  "/",
  [authenticator, checkSchema(userPutSchema), validate],
  async (req, res) => {
    try {
      let verified = 1;
      if ("mail_id" in req.body) {
        if (req.body.mail_id !== req.user.mail_id) {
          verified = 0;
        }
        // Verify email and contact no if are to be updated.
      }
      // if (password in req.body) {
      //   req.body.password = bcrypt(req.body.password, 10);
      // }
      console.log(
        `UPDATE customer SET ? ,verified = ${verified} WHERE customer_id=${req.user.customer_id} AND verified=1;`,
        req.body
      );
      result = await db
        .promise()
        .query(
          `UPDATE customer SET ? ,verified = ${verified} WHERE customer_id=${req.user.customer_id} AND verified=1;`,
          req.body
        );
      result[0].affectedRows == 0
        ? res.sendStatus(404)
        : res
            .status(200)
            .json({ Changed: `${result[0].affectedRows} records changed` });
    } catch (err) {
      await db.rollback();
      throw err;
    }
  }
); // Update details of specified user

router.post(
  "/register/:type",
  [checkSchema(userPostSchema), validate],
  async (req, res) => {
    try {
      console.log(req.body);
      const i = req.body;
      if (req.params.type === "admin") {
        i.admin = true;
      } else if (req.params.type === "customer") {
        i.admin = false;
      } else {
        res.sendStatus(400);
      }
      i.verified = 0;
      i.admin = i.admin ? i.admin : 0;
      // if (mail in req.body) {
      //   SendMail(
      //     mail,
      //     "Account Verification",
      //     "",
      //     `<p>Click on the button to verify your mail passed as the mail ID in Canteen App</p>
      //     <button><a href='http://localhost:5000/users/verify'>Verify</a></button>
      //     <p>Don't click if you are not the one who entered the mail ID</p>`
      //   ); // Verify email and contact no if are to be updated.
      // }
      insertQuery = `INSERT INTO customer
      (first_name, middle_name, last_name, mail_id, contact_no, verified, password, admin) 
      VALUES ('${i.first_name}', '${i.middle_name}', '${i.last_name}', '${i.mail_id}', 
      '${i.contact_no}', ${i.verified}, '${i.password}', ${i.admin});`;
      console.log(insertQuery);
      const result = await db.promise().query(insertQuery);
      console.log(result);
      result[0].affectedRows == 0
        ? res.sendStatus(404)
        : res
            .status(200)
            .json({ Changed: `${result[0].affectedRows} record(s) changed` });
    } catch (err) {
      res.status(400).json({
        error: "Entry exists or fields are incorrect",
      });
      db.rollback();
      console.log(err);
    }
  }
); // Create new user

router.post(
  "/verify",
  [checkSchema(verifyMailSchema), validate],
  async (req, res) => {
    try {
      if ("mail" in req.body) {
        const result = await db
          .promise()
          .query(
            `UPDATE customer SET verified=1 WHERE mail_id = '${req.body.mail}';`
          );
        result[0].affectedRows == 0
          ? res.sendStatus(404)
          : res
              .status(200)
              .json({ Changed: `${result[0].affectedRows} record(s) changed` });
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      db.rollback();
      console.log(err);
      res.sendStatus(400);
    }
  }
); // Verify the mail ID given by user

module.exports = router;
