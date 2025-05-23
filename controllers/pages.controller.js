const Product = require("../models/product.model");
const { showDiscount, calculateNewPrice } = require('../helpers/discount');
const {formatProductTitle} = require('../helpers/home')

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
      formatProductTitle,
    });
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
};

const loginPage = (req, res) => {
  res.render("../views/login.ejs",  { csrfToken: req.csrfToken() });
};

const registerPage = (req, res) => {
  res.render("../views/register.ejs",  { csrfToken: req.csrfToken() });
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
    csrfToken: req.csrfToken()
  });
};

module.exports = {
  homePage,
  loginPage,
  registerPage,
  discountPage,
}