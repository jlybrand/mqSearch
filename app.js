const config = require("./lib/config");
const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
// remove from routes and 'use' here...
const { body, validationResult } = require("express-validator");
const store = require("connect-loki");
const catchError = require("./lib/catch-error");
const app = express();
const LokiStore = store(session);
const searchRouter = require('./routes/searchRouter');
const userRouter = require('./routes/userRouter');
const host = config.HOST;
const port = config.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(logger("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: false,
  },
  name: "coredb-session-id",
  resave: false,
  saveUninitialized: true,
  secret: config.SECRET,
  store: new LokiStore({}),
}));

app.use((req, res, next) => {
    res.locals.address = req.session.address;
    res.locals.zipcode = req.session.zipcode;
    res.locals.radius = req.session.radius;
    res.locals.firstname = req.session.firstname;
    res.locals.lastname = req.session.lastname;
    res.locals.username = req.session.username;
    res.locals.searchResults = req.session.searchResults;
    res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.use(flash());

app.use('/search', searchRouter);
app.use('/user', userRouter);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home",
    { title: "Venit" }
  );
});

app.use((err, req, res, _next) => {
  console.log('server error handler: ', err);
  res.status(404).send(err.message);
});

app.listen(port, host, () => {
  console.log(`Listening on port ${port} of ${host}!`);
});
