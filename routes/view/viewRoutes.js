const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../../products");

router.get("/home", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const products = await Product.find({});

    res.render("../views/home.ejs", {
      user: req.session.user,
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error retrieving products");
  }
});

router.get("/login", (req, res) => {
  res.render("../views/login.ejs");
});

router.get("/register", (req, res) => {
  res.render("../views/register.ejs");
});

module.exports = router;
