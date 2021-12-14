const { db } = require("../database/database");

const nameValidation = {
  notEmpty: true,
  errorMessage: "First Name cannot be empty",
  isString: true,
  isLength: {
    min: 2,
    max: 20,
  },
};

const mailValidation = {
  notEmpty: true,
  errorMessage: "Email should not be empty",
  isEmail: true,
  errorMessage: "Email should be valid",
  isLength: {
    max: 50,
  },
  errorMessage: "Email should be max 50 character long",
  custom: {
    options: (value) => {
      return db
        .promise()
        .query(`SELECT * from customer WHERE mail_id='${value}';`)
        .then((user) => {
          if (user[0].length > 0) {
            return Promise.reject("Email address is already taken");
          }
        });
    },
  },
};

const verifyMailSchema = {
  mail: {
    notEmpty: true,
    errorMessage: "Email should not be empty",
    isEmail: true,
    errorMessage: "Email should be valid",
    isLength: {
      max: 50,
    },
    errorMessage: "Email should be max 50 character long",
    custom: {
      options: (value) => {
        return db
          .promise()
          .query(`SELECT * from customer WHERE mail_id='${value}';`)
          .then((user) => {
            if (user[0].length == 1 && !user[0][0].verified)
              return { message: "Good to go" };
            else return Promise.reject("Email address is already taken");
          });
      },
    },
  },
}; // verified

const loginSchema = {
  customer_id: {
    notEmpty: true,
    errorMessage: "Customer ID should not be empty",
    isInt: true,
    errorMessage: "Customer ID is Enumerated value",
    custom: {
      options: (value, { req, location, path }) => {
        return db
          .promise()
          .query(
            `SELECT * from customer WHERE customer_id='${value}' AND admin=${req.body.admin} AND verified=1;`
          )
          .then((user) => {
            if (user[0].length <= 0) {
              return Promise.reject("Customer not found/registered");
            } else {
              return value;
            }
          });
      },
    },
  },
  mail_id: {
    notEmpty: true,
    errorMessage: "Email should not be empty",
    isEmail: true,
    errorMessage: "Email should be valid",
    isLength: {
      max: 50,
    },
    errorMessage: "Email should be max 50 character long",
    custom: {
      options: (value, { req, location, path }) => {
        return db
          .promise()
          .query(
            `SELECT * from customer WHERE mail_id='${value}' AND customer_id=${req.body.customer_id};`
          )
          .then((user) => {
            if (user[0].length === 1) {
              return value;
            } else {
              return Promise.reject("Email address is already taken");
            }
          });
      },
    },
  },
  admin: {
    notEmpty: true,
    errorMessage: "deluxe should not be empty",
    isBoolean: true,
    errorMessage: "deluxe should be boolean value",
  },
}; // verified

const userPutSchema = {
  first_name: nameValidation,
  middle_name: nameValidation,
  last_name: nameValidation,
  password: {
    notEmpty: true,
    errorMessage: "Password should not be empty",
    isStrongPassword: {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumbers: 1,
      minSymbols: 1,
      maxLength: 100,
    },
    errorMessage: `Password should be minimum of 8 characters and must contain
     atleast one uppercase, one lowercase, one special character and one number`,
  },
  contact_no: {
    notEmpty: true,
    errorMessage: "Contact Number should not be empty",
    isMobilePhone: true,
    errorMessage: "Contact Number should be valid",
  },
  mail_id: {
    notEmpty: true,
    errorMessage: "Email should not be empty",
    isEmail: true,
    errorMessage: "Email should be valid",
    isLength: {
      max: 50,
    },
    errorMessage: "Email should be max 50 character long",
    custom: {
      options: (value, { req, location, path }) => {
        return db
          .promise()
          .query(
            `SELECT * from customer WHERE mail_id='${value}' AND customer_id<>'${req.user.customer_id}';`
          )
          .then((user) => {
            console.log(
              user[0],
              `SELECT * from customer WHERE mail_id='${value}' AND customer_id<>'${req.user.customer_id}'`
            );
            if (user[0].length > 0) {
              return Promise.reject("Email address is already taken");
            } else {
              return { message: "Good to go" };
            }
          });
      },
    },
  },
}; //verified

const userPostSchema = {
  first_name: nameValidation,
  middle_name: nameValidation,
  last_name: nameValidation,
  password: {
    notEmpty: true,
    errorMessage: "Password should not be empty",
    isStrongPassword: {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumbers: 1,
      minSymbols: 1,
      maxLength: 100,
    },
    errorMessage: `Password should be minimum of 8 characters and must contain
     atleast one uppercase, one lowercase, one special character and one number`,
  },
  contact_no: {
    notEmpty: true,
    errorMessage: "Contact Number should not be empty",
    isMobilePhone: true,
    errorMessage: "Contact Number should be valid",
  },
  mail_id: {
    notEmpty: true,
    errorMessage: "Email should not be empty",
    isEmail: true,
    errorMessage: "Email should be valid",
    isLength: {
      max: 50,
    },
    errorMessage: "Email should be max 50 character long",
    custom: {
      options: (value, { req, location, path }) => {
        return db
          .promise()
          .query(`SELECT * from customer WHERE mail_id='${value}';`)
          .then((user) => {
            if (user[0].length > 0) {
              return Promise.reject("Email address is already taken");
            } else {
              return { message: "Good to go" };
            }
          });
      },
    },
  },
}; //verified

const orderSchema = {
  bill: {
    notEmpty: true,
    errorMessage: "Bill name cannot be empty",
    isInt: true,
    errorMessage: "Bill should be numerical value",
  },
  // orderstatus: {
  //   notEmpty: true,
  //   errorMessage: "Status of the order cannot be empty",
  //   isInt: true,
  //   errorMessage: "Status of the order should be Enumerated value",
  // },
  suggestion: {
    notEmpty: true,
    errorMessage: "Suggestion cannot be empty",
    isString: true,
    errorMessage: "Suggestion should be a string",
  },
  paymentmode: {
    notEmpty: true,
    errorMessage: "Payment mode should not be empty",
    isBoolean: true,
    errorMessage: "Payment mode should be boolean value",
  },
  customer: {
    notEmpty: true,
    errorMessage: "Customer ID should not be empty",
    isInt: true,
    errorMessage: "Customer ID is Enumerated value",
    custom: {
      options: (value, { req, location, path }) => {
        return db
          .promise()
          .query(
            `SELECT * from customer WHERE customer_id='${value}' AND admin=${req.user.admin} AND verified=1;`
          )
          .then((user) => {
            if (user[0].length <= 0) {
              return Promise.reject("Customer not found/registered");
            } else {
              return true;
            }
          });
      },
    },
  },
  // Following fields not handled as generated by server
  // placedon DATETIME NOT NULL,
  // completedon DATETIME NOT NULL,
  // transaction VARCHAR(50),
};

const delieverySchema = {
  otp: {
    notEmpty: true,
    errorMessage: "OTP should not be empty",
    isString: true,
    errorMessage: "OTP should be string",
    isLength: {
      max: 6,
      min: 6,
    },
    errorMessage: "OTP should be 6 characters long",
  },
  customer: {
    notEmpty: true,
    errorMessage: "Customer ID should not be empty",
    isInt: true,
    errorMessage: "Customer ID is Enumerated value",
    custom: {
      options: (value, { req, location, path }) => {
        return db
          .promise()
          .query(
            `SELECT * from customer WHERE customer_id='${value}' AND admin=${req.user.admin} AND verified=1;`
          )
          .then((user) => {
            if (user[0].length <= 0) {
              return Promise.reject("Customer not found/registered");
            } else {
              return true;
            }
          });
      },
    },
  },
  order: {
    notEmpty: true,
    errorMessage: "Order ID should not be empty",
    isInt: true,
    errorMessage: "Order ID is Enumerated value",
    custom: {
      options: (value) => {
        return db
          .promise()
          .query(`SELECT * from live_orders WHERE order_id='${value}';`)
          .then((user) => {
            if (user[0].length < 0) {
              return Promise.reject("Order not found");
            }
          });
      },
    },
  },
};

module.exports = {
  userPutSchema,
  userPostSchema,
  orderSchema,
  loginSchema,
  verifyMailSchema,
  delieverySchema,
};
