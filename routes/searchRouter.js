const config = require("../lib/config");
const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const searchController = require('../controllers/searchController');
const API_URL = config.API_URL;
const API_KEY_NAME = config.API_KEY_NAME;
const API_KEY_VALUE = config.API_KEY_VALUE;

router.post('/',
  [
    body("address")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Street address is required.")
      .bail()
      .isLength({ max: 40 })
      .withMessage("Address is too long. Maximum length is 25 characters."),

    body("zipcode")
      .trim() // console.log(res);
      .isPostalCode('US')
      .withMessage("Zipcode is required.")
      .bail()
      .isLength({ max: 12 })
      .withMessage("Zipcode is too long. Maximum length is 25 characters."),

    body("radius")
      .trim()
      .isInt()
      .withMessage("Only numeric characters allowed.")
      .withMessage("Radius is required.")
      .bail()
  ],

  (req, res, next) => {
    let errors = validationResult(req);
    console.log('Errors: ', errors);
    if (!errors.isEmpty()) {
      res.render("home", {
        title: 'Correct Form Errors',
        errorMessages: errors.array().map(error => error.msg),
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        radius: req.body.radius,
      });
    } else {
      next();
    }
  },
  searchController.getSearchResponse,
);

module.exports = router;

