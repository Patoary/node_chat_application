//external imports
const express = require("express");

// internal imports
const { getUsers } = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const router = express.Router();

//user page
router.get("/", decorateHtmlResponse("Users"), getUsers);

//add user
router.post("/", avatarUpload);
module.exports = router;
