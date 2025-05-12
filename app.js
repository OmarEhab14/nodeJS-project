const express = require("express");
const app = express();
const session = require("express-session");
const productRoutes = require('./routes/product.route');
const userRoutes = require('./routes/user.route');
const discountRoutes = require('./routes/discount.route');
const authRoutes = require('./routes/authentication.route');
const pageRoutes = require('./routes/pages.route');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')
const csrf = require('csurf')


app.use(methodOverride('_method'));

app.use(cookieParser());
const csrfProtection = csrf({ cookie: false }); // false because it's a session and not a cookie

app.set("view-engine", "ejs");
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  } else {
    return csrfProtection(req, res, next);
  }
});
// app.use("/api/users", require("./routes/usersApi/getRoutes"));
// app.use("/api/users", require("./routes/usersApi/postRoutes"));
// app.use("/api/users", require("./routes/usersApi/putRoutes"));
// app.use("/api/users", require("./routes/usersApi/deleteRoutes"));

// app.use("/api/products", require("./routes/productsApi/getRoutes"));
// app.use("/api/products", require("./routes/productsApi/postRoutes"));
// app.use("/api/products", require("./routes/productsApi/putRoutes"));
// app.use("/api/products", require("./routes/productsApi/deleteRoutes"));

// app.use("/", require("./routes/view/authRoutes"));
// app.use("/", require("./routes/view/viewRoutes"));

// app.use("/api/discount", require("./routes/discountApi/applyDiscount"));
// app.use("/api/discount", require("./routes/discountApi/removeDiscount"));

app.use('/api', productRoutes);

app.use('/api', userRoutes);

app.use('/api', discountRoutes);

app.use('/', authRoutes);

app.use('/', pageRoutes);

module.exports = app;