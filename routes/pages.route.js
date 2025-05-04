// routes/pages.route.js
const express = require("express");
const {
  homePage,
  loginPage,
  registerPage,
  discountPage,
} = require("../controllers/pages.controller");

const router = express.Router();

router.get("/home", homePage);
router.get("/login", loginPage);
router.get("/register", registerPage);
router.get("/discount", discountPage);

module.exports = router;
