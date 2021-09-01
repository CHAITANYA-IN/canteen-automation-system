const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const { db } = require("../database");

passport.serializeUser((user, done) => {
  done(null, user.customer_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db
      .promise()
      .query(`SELECT * FROM customer WHERE customer_id=${id};`);
    if (result[0][0]) {
      done(null, result[0][0]);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await db
        .promise()
        .query(`SELECT * FROM customer WHERE customer_id=${username};`);
      if (result[0].length === 0) {
        done(null, false);
      } else {
        if (result[0][0].password === password) {
          done(null, result[0][0]);
        } else {
          done(null, false);
        }
      }
    } catch (err) {
      done(err, false);
    }
  })
);
