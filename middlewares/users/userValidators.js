//external imports
const { check } = require("express-validator");
const createError = require("http-errors");

//internal imports
const User = require("../../models/People");
// add user
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

module.exports = {
  addUserValidations,
};
