//external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

//internal imports
const User = require("../../models/People");
const { error } = require("console");
// add user. validations
const addUserValidations = [
  // check name validation
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),
  // check email validation
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already is use!");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),
  // check phone_number validation
  check("mobile")
    .isMobilePhone(["bn-BD", "ja-JP"], { strictMode: true })
    .withMessage("Mobile number must be a valid BD ro JP mobile number")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile already is use!");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),
  // check password validation
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should be contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

// addUserValidationHandler for handle the validations errors
const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/public/uploads/avatars/${filename}`),
        (error) => {
          if (error) console.log(error);
        }
      );
    }
    res.status(500).join({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  addUserValidations,
  addUserValidationHandler,
};
