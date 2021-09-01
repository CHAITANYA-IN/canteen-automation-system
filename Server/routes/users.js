const SendMail = require("../mail-info");
const { Router } = require("express");
// const {db} = require("database");

const authenticator = require("../middlewares");

const router = Router();

router.get("/details", async (req, res) => {
  console.log(req.user);
  results = await db
    .promise()
    .query(`SELECT * FROM customer where customer_id=${req.user.customer_id};`);
  // req.details.customer_id;
  console.log("Results=", results[0][0]);
  results[0][0].length == 0
    ? res.sendStatus(404).json({ message: "No such customer" })
    : res.status(200).json(results[0][0]);
}); // Get user details

router.get("/", (req, res) => {}); // Get all Users

router.get("/:id", (req, res) => {}); // Get details of a specific user

router.get("/:id/orders", (req, res) => {}); // Get all past orders by specified user

router.get("/:id/orders/:orderID", (req, res) => {}); // Get details of an order by the specified user

router.put("/:id", (req, res) => {}); // Update details of specified user

router.delete("/:id", (req, res) => {}); // Delete the specified user

router.post("/", async (req, res) => {
  try {
    const i = req.body;
    const query = `INSERT INTO customer
    (first_name, middle_name, last_name, mail_id, contact_no, password) 
    VALUES ('${i.first}', '${i.middle}', '${i.last}', '${i.mail}', '${i.phone}', '${i.password}');`;
    console.log("Req=", query);
    const result = await db.promise().query(query);
    console.log(result);
    if (result[0].affectedRows == 0) {
      res.sendStatus(404);
    } else {
      let user_id_info = await db
        .promise()
        .query(`SELECT customer_id FROM CUSTOMER WHERE mail_id="${i.mail}";`);
      console.log("User id info=", user_id_info[0][0]);
      const html = `
      <H1>Hello ${i.first} ${i.middle} ${i.last}</h1>
      <p>This is your userId: ${user_id_info[0][0].customer_id}</p>
      <p>Thank you for using our app</p>
      <p>Now you can login<p>`;
      SendMail(i.mail, "User id info", "", html);
      res
        .status(200)
        .json({ Changed: `${result[0].affectedRows} record(s) changed` });
    }
  } catch (err) {
    res.status(400).json({
      error: "Entry exists or fields are incorrect",
    });
    db.rollback();
    console.log(err);
  }
}); // Create new user

module.exports = router;
