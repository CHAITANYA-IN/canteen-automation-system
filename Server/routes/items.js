const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const { db } = require("../database/database");
const {authenticator} = require("../services/middlewares");

const router = Router();

router.get("/", authenticator, async (req, res) => {
  console.log("Items Request");
  results = await db.promise().query("SELECT * FROM items;");
  res.json(results[0]).status(200);
}); // Get all items

router.get("/:id", authenticator, async (req, res) => {
  results = await db
    .promise()
    .query(`SELECT * FROM items where item_id=${req.params.id};`);
  if (results[0].length == 0) res.status(400).json({ message: "Bad Request" });
  else {
    res.json(results[0]).status(200);
    console.log(results[0]);
  }
}); // Get details of specified item

router.get("/:id/image", authenticator, async (req, res) => {
  results = await db
    .promise()
    .query(`SELECT image FROM items where item_id=${req.params.id};`);
  if (results[0].length == 0) res.status(400).json({ message: "Bad Request" });
  else {
    res.contentType("image/jpg").status(200);
    console.log(results[0]);
  }
}); // Get details of specified item

router.post(
  "/",
  [
    check("name")
      .notEmpty()
      .withMessage("Item Name cannot be empty")
      .isLength({ max: 30 })
      .withMessage("Item Name too lengthy")
      .isString()
      .withMessage("Item name should be a string"),
    check("price")
      .notEmpty()
      .withMessage("Price cannot be empty")
      .isInt()
      .withMessage("Price should be integer"),
    authenticator,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, description } = req.body;
    const image = req.files.image;
    try {
      const records = await db
        .promise()
        .query(`SELECT * FROM items where name='${name}';`);
      if (records[0].length > 0) {
        res
          .status(400)
          .json({ message: "Record already exists", item: records[0] });
      } else {
        const result = await db.promise().query(
          `INSERT INTO items(name, image, price, description) 
            VALUES ('${name}', '${image}', ${price}, '${
            description ? description : "null"
          }');`
        );
        if (result[0].affectedRows === 0) {
          res.status(400).json({ message: "Bad Insert parameters" });
        }
        console.log(result);

        res.status(201).json({ message: "Created Item" });
      }
    } catch (err) {
      records ? await db.rollback() : 1;
      throw err;
    }
  }
); // Create a new food item

router.put(
  "/:id",
  [
    check("name")
      .notEmpty()
      .withMessage("Item Name cannot be empty")
      .isLength({ max: 30 })
      .withMessage("Item Name too lengthy")
      .isString()
      .withMessage("Item name should be a string"),
    check("price")
      .notEmpty()
      .withMessage("Price cannot be empty")
      .isInt()
      .withMessage("Price should be integer"),
    authenticator,
  ],
  async (req, res) => {
    try {
      console.log(req);
      result = await db
        .promise()
        .query(
          `UPDATE items SET image='${req.files.image}' ? WHERE item_id=${req.params.id};`,
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
); // Update the specified food item

router.delete("/:id", authenticator, async (req, res) => {
  try {
    results = await db
      .promise()
      .query(`DELETE FROM items WHERE item_id=${req.params.id};`);
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
}); // Delete the specified food item

module.exports = router;
