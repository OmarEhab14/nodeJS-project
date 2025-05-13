const express = require("express");
const app = express();
const session = require("express-session");
const productRoutes = require('./routes/product.route');
const userRoutes = require('./routes/user.route');
const discountRoutes = require('./routes/discount.route');
const authRoutes = require('./routes/authentication.route');
const pageRoutes = require('./routes/pages.route');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser') // to read csrf tokens
const csrf = require('csurf')
const helmet = require("helmet");
require('dotenv').config();

app.use(methodOverride('_method'));

app.use(cookieParser());
const csrfProtection = csrf({ cookie: false }); // false because it's a session and not a cookie

app.use(helmet()); // provides security headers

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "https://kit.fontawesome.com"
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://f.nooncdn.com",
      ],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      
      // Corrected directive names:
      'frame-ancestors': ["'none'"],     // Prevents embedding in iframes (anti-clickjacking)
      'form-action': ["'self'"],         // Only allow form submissions to same origin
      'base-uri': ["'self'"],            // Limits <base href="...">

      'frame-src': ["'none'"],           // Controls what can be loaded in iframes
      'worker-src': ["'none'"],          // Web Workers (Service Workers, etc.)
      'manifest-src': ["'self'"],        // Web app manifests
      'child-src': ["'none'"],           // Deprecated but still used by some browsers

      upgradeInsecureRequests: [],    // Forces HTTPS connections
      blockAllMixedContent: [],       // Prevent loading HTTP assets on HTTPS pages
    },
    reportOnly: false
  })
);


app.set("view-engine", "ejs");
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,         // Prevents JS access to the cookie
      sameSite: 'strict',     // Or 'lax' depending on your needs
      secure: app.get('env') === 'production', // Only send over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
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

app.get('/test-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
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