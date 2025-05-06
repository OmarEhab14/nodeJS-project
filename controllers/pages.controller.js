const Product = require("../models/product.model");
const { showDiscount, calculateNewPrice } = require('../helpers/discount');

const homePage = async (req, res) => {
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
      showDiscount,
      calculateNewPrice,
    });
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
};

const loginPage = (req, res) => {
  res.render("../views/login.ejs");
};

const registerPage = (req, res) => {
  res.render("../views/register.ejs");
};

const discountPage = async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/home');
  }
  const products = await Product.find({});
  res.render("../views/discount_manager.ejs", {
    user: req.session.user,
    products: products,
    showDiscount,
    calculateNewPrice,
  });
};

module.exports = {
  homePage,
  loginPage,
  registerPage,
  discountPage,
}