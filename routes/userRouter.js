const config = require("../lib/config");
const User = require("../models/user");
const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userController = require('../controllers/userController');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Routes 
router.get('/register', async (req, res) => {
  res.render('register', {
    title: 'Registration'
  });
});

router.post('/register',
  [
    body("firstname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name is required.")
      .bail(),

    body("lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name is required.")
      .bail(),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide your email.")
      .bail(),

    body("username")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Username is required.")
      .bail(),

    body("password")
      .isLength({ min: 3 })
      .withMessage("Password is required.")
      .bail()

  ],

  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      res.render("register", {
        errorMessages: errors.array().map(error => error.msg),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
      });
    } else {
      next();
    }
  },

  userController.storeUser,
);

module.exports = router;