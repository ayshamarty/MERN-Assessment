const express = require("express");
const router = express.Router();

const Users = require("../models/userMod");

// @routes GET user/getAll
// @desc Get all users
// @access Public

router.get("/getAll", (req, res) => {
    const errors = {};
  
    Users.find()
      .then(Users => {
        res.json(Users);
      })
      .catch((err) => {
        errors.findItems = err;
        res.status(404).json(errors);
      });
  });



  module.exports = router;