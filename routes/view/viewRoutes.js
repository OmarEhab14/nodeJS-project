const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../../products");
const products = require("../../products");

router.get("/home", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.isAdmin == true) {
    return res.redirect("/discount");
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

router.get("/discount", async (req, res) => {
  const products = await Product.find({});
  res.render("../views/discount_manager.ejs", {
    user: req.session.user,
    products: products,
  });
})

module.exports = router;
