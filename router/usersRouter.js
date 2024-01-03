//external imports
const express = require("express");
const router = express.Router();

// internal imports
const { getUsers } = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const { addUserValidations } = require("../middlewares/users/userValidators");
//user page
router.get("/", decorateHtmlResponse("Users"), getUsers);

//add user
router.post("/", avatarUpload, addUserValidations);
module.exports = router;
