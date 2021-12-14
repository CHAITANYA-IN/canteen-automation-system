const { Router } = require("express");
const { check, validationResult } = require("express-validator");

const { db } = require("../database/database");
const { authenticator } = require("../services/middlewares");

const router = Router();

router.get("/", authenticator, async (req, res) => {
  console.log("Items Request");
  results = await db
    .promise()
    .query(
      "select items.item_id, items.name, menu.price, items.image, items.description from menu, items WHERE menu.item_id = items.item_id;"
    );
  res.json(results[0]).status(200);
}); // Get all items from menu

router.get("/:id", authenticator, async (req, res) => {
  results = await db
    .promise()
    .query(
      `select items.item_id, items.name, menu.price, items.image, items.description from items, menu WHERE menu.item_id = items.item_id AND menu.item_id=${req.params.id};`
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

router.delete("/", async (req, res) => {
  try {
    results = await db.promise().query(`TRUNCATE TABLE menu;`);
    console.log(results);
    if (results[0].affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json({ message: "Menu cleared" });
    }
  } catch (err) {
    db.rollback();
    throw err;
  }
});

router.post("/", [authenticator], async (req, res) => {
  try {
    menuQuery = `INSERT INTO menu VALUES`;
    req.body.items.forEach((item, index) => {
      menuQuery += `(${item.id}, ${item.price})`;
      menuQuery += index != items.length - 1 ? ", " : ";";
    });

    results = await db.promise().query(menuQuery);
    console.log(results);
    result[0].affectedRows <= 0
      ? res.sendStatus(400)
      : res
          .status(200)
          .json({ Changed: `${result[0].affectedRows} record(s) changed` });
  } catch (err) {
    throw err;
  }
});

module.exports = router;
