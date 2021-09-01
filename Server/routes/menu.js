const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const { db } = require("../database");
const authenticator = require("../middlewares");

const router = Router();

router.get("/", authenticator, async (req, res) => {
  console.log("Items Request");
  results = await db
    .promise()
    .query(
      "select items.item_id, items.name, menu.price, items.image, items.description from menu, items  WHERE menu.item_id = items.item_id;"
    );
  console.log("requestserved", results);
  res.status(200).json(results[0]);
}); // Get all items from menu

router.get("/:id", authenticator, async (req, res) => {
  results = await db
    .promise()
    .query(
      `select item.item_id, item.name, menu.price, item.image, item.description from items, menu WHERE menu.item_id = items.item_id AND menu.item_id=${req.params.id};`
    );
  if (results[0].length == 0) res.sendStatus(404);
  else {
    res.json(results[0]).status(200);
    console.log(results[0]);
  }
}); // Get details of item from menu

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
    console.log(req.user);

    try {
      if (Object.keys(req.body).length !== 1) {
        res
          .status(400)
          .json({ message: "only price attribute can be changed" });
      }
      result = await db
        .promise()
        .query(`UPDATE menu SET ? WHERE item_id=${req.params.id};`, req.body);
      result[0].affectedRows == 0
        ? res.sendStatus(404)
        : res
            .status(200)
            .json({ Changed: `${result[0].affectedRows} records changed` });
    } catch (err) {
      db.rollback();
      throw err;
    }
  }
); // Set up the menu

router.delete("/:id", authenticator, async (req, res) => {
  try {
    results = await db
      .promise()
      .query(`DELETE FROM menu WHERE item_id=${req.params.id};`);
    console.log(results);
    if (results[0].affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json({ message: "Deleted" });
    }
  } catch (err) {
    db.rollback();
    throw err;
  }
}); // Remove any unavailable items from menu

module.exports = router;
